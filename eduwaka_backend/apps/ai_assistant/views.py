from rest_framework import permissions, status
import google.generativeai as genai
from django.conf import settings
import json
import re

from rest_framework.response import Response
from rest_framework.views import APIView
from apps.ai_assistant.serializers import EligibilityCheckRequestSerializer, ChatbotRequestSerializer, InstitutionRequestSerializer
from .models import ChatHistory

# Configure Gemini API with the key using the settings settings
genai.configure(api_key=settings.GEMINI_API_KEY)
# Initialize the Gemini model for content generation
model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")

# Institution Overview View
class InstitutionOverviewAPIView(APIView):
  permission_classes = [permissions.AllowAny]

  def post(self, request, *args, **kwargs):
    # Validate the incoming data using the serializer
    serializer = InstitutionRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    institution_name = serializer.validated_data['institution_name']

    # Detailed prompt for the Gemini model, requesting JSON output
    prompt = f"""
    Provide a concise overview of the Nigerian institution named "{institution_name}".
    The overview should be structured as a JSON object with the following fields:
    - "name": The full name of the institution.
    - "type": The type of institution (e.g., "Federal University", "State Polytechnic", "Private University").
    - "location": The city and state where the main campus is located.
    - "established_year": The year it was founded.
    - "overview": A brief, one-paragraph summary of the institution's history and mission.
    - "relevance": A short description of what the institution is known for (e.g., academic excellence, specific faculties, or campus life).
    
    If the institution is not a recognized Nigerian tertiary institution, return a JSON object with an "error" field.

    Example JSON response for a valid institution:
    {{
      "name": "University of Lagos",
      "type": "Federal University",
      "location": "Lagos, Lagos State",
      "established_year": 1962,
      "overview": "The University of Lagos, founded in 1962, is a leading research university. It is one of the nation's first generation universities and is known for its academic and social influence.",
      "relevance": "UNILAG is well-regarded for its business and law faculties, and is one of the most prestigious universities in Nigeria."
    }}

    Example JSON response for an invalid institution:
    {{
      "error": "The institution '{institution_name}' could not be found or is not a recognized Nigerian institution."
    }}
    """

    try:
      # Call Gemini API with the prompt
      response = model.generate_content(
        contents=[{"parts": [{"text": prompt}]}],
        generation_config={
          "response_mime_type": "application/json",
        }
      )

      # Parse the JSON response from the model
      gemini_output_text = response.text
      institution_data = json.loads(gemini_output_text)

      # Check for a specific error from the AI model
      if "error" in institution_data:
        return Response(
          {"detail": institution_data["error"]},
          status=status.HTTP_404_NOT_FOUND
        )

      return Response(institution_data, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        print(f"Error decoding JSON from Gemini API: {response.text}")
        return Response(
            {"detail": "An unexpected error occurred while parsing the AI response."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        print(f"Error calling Gemini API for institution overview: {e}")
        return Response(
            {"detail": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

#  Subjects that MUST appear as credits 
COMPULSORY_SUBJECTS = {"english", "mathematics"}

# Patterns used to normalise subject names coming from free-text O'Level strings
SUBJECT_ALIASES = {
    "english language": "english",
    "eng": "english",
    "maths": "mathematics",
    "math": "mathematics",
    "further maths": "further mathematics",
    "further math": "further mathematics",
    "lit in english": "literature in english",
    "literature": "literature in english",
    "agric": "agricultural science",
    "agric science": "agricultural science",
    "civic": "civic education",
    "econs": "economics",
    "govt": "government",
    "phy": "physics",
    "chem": "chemistry",
    "bio": "biology",
    "crk": "christian religious knowledge",
    "irk": "islamic religious knowledge",
    "c.r.k": "christian religious knowledge",
    "i.r.k": "islamic religious knowledge",
    "c.r.s": "christian religious studies",
    "i.r.s": "islamic religious studies",
    "ict": "information technology",
    "comp": "computer science",
    "td": "technical drawing",
}

GRADE_PATTERN = re.compile(r'\b(A1|B2|B3|C4|C5|C6|D7|E8|F9)\b', re.IGNORECASE)
CREDIT_GRADES = {"a1", "b2", "b3", "c4", "c5", "c6"}


class EligibilityCheckAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  #  Helpers ─

  def _normalise_subject(self, raw: str) -> str:
    """Lower-case and resolve common aliases."""
    cleaned = raw.strip().lower()
    return SUBJECT_ALIASES.get(cleaned, cleaned)

  def _parse_sitting(self, sitting_text: str) -> dict[str, str]:
      """
      Parse a free-text O'Level sitting into {normalised_subject: grade}.

      Expects formats like:
        "English Language: A1, Mathematics: B2, Physics: C4"
        "English - A1 | Mathematics - B2"
      Returns {} if nothing parseable is found.
      """
      results: dict[str, str] = {}
      if not sitting_text:
        return results

      # Split on common delimiters: comma, semicolon, pipe, newline
      entries = re.split(r'[,;\|\n]+', sitting_text)

      for entry in entries:
        entry = entry.strip()
        if not entry:
          continue

        # Try "Subject: Grade" or "Subject - Grade" or "Subject Grade"
        match = re.match(
          r'^(.+?)[\s:\-–]+(' + '|'.join(GRADE_PATTERN.pattern[3:-3].split('|')) + r')\s*$',
          entry,
          re.IGNORECASE,
        )
        if match:
          subject = self._normalise_subject(match.group(1))
          grade = match.group(2).upper()
          # Keep best grade if subject appears in both sittings (handled at combine step)
          results[subject] = grade

      return results

  def _combine_sittings(
      self,
      sitting1: dict[str, str],
      sitting2: dict[str, str],
  ) -> dict[str, str]:
      """
      Merge two sittings; keep the best (highest) grade per subject so that
      the same subject is never double-counted.
      Grade ranking: A1 > B2 > B3 > C4 > C5 > C6 > D7 > E8 > F9
      """
      GRADE_RANK = {"A1": 1, "B2": 2, "B3": 3, "C4": 4, "C5": 5, "C6": 6, "D7": 7, "E8": 8, "F9": 9}
      combined = dict(sitting1)
      for subject, grade in sitting2.items():
          if subject not in combined:
              combined[subject] = grade
          else:
              # Lower rank number = better grade
              if GRADE_RANK.get(grade, 99) < GRADE_RANK.get(combined[subject], 99):
                  combined[subject] = grade
      return combined

  def _analyse_credits(
      self,
      sitting1_text: str,
      sitting2_text: str,
      use_two_sittings: bool,
  ) -> dict:
      """
      Returns a structured credit report:
      {
        "sitting1": {subject: grade},
        "sitting2": {subject: grade},
        "combined": {subject: grade},
        "credit_subjects": [subject],       # subjects with credit grades
        "total_credits": int,
        "has_english": bool,
        "has_mathematics": bool,
        "has_compulsory": bool,
        "has_min_credits": bool,            # ≥ 5 credits incl. English & Maths
        "missing_compulsory": [subject],
      }
      """
      s1 = self._parse_sitting(sitting1_text)
      s2 = self._parse_sitting(sitting2_text) if use_two_sittings else {}
      combined = self._combine_sittings(s1, s2)

      credit_subjects = [subj for subj, grade in combined.items() if grade.lower() in CREDIT_GRADES]

      has_english = "english" in credit_subjects
      has_mathematics = "mathematics" in credit_subjects
      missing_compulsory = [s for s in COMPULSORY_SUBJECTS if s not in credit_subjects]

      total_credits = len(credit_subjects)
      has_min_credits = total_credits >= 5 and has_english and has_mathematics

      return {
        "sitting1": s1,
        "sitting2": s2,
        "combined": combined,
        "credit_subjects": credit_subjects,
        "total_credits": total_credits,
        "has_english": has_english,
        "has_mathematics": has_mathematics,
        "has_compulsory": has_english and has_mathematics,
        "has_min_credits": has_min_credits,
        "missing_compulsory": missing_compulsory,
      }

  #  Prompt builder 
  def _build_prompt(
      self,
      *,
      institution_name: str,
      desired_course: str,
      o_level_sittings: int,
      o_level_results_combined: str,
      jamb_score: int,
      jamb_subjects: str,
      credit_report: dict,
  ) -> str:
      # Pre-compute human-readable summaries so the model has less to infer
      credit_list = ", ".join(credit_report["credit_subjects"]) or "None detected"
      missing_compulsory = (
        ", ".join(credit_report["missing_compulsory"]).title()
        if credit_report["missing_compulsory"]
        else "None"
      )
      flags = []
      if not credit_report["has_min_credits"]:
        flags.append(
          f"INSUFFICIENT O'LEVEL CREDITS: student has {credit_report['total_credits']} credit(s) "
          f"(need ≥5 including English and Mathematics). "
          f"Missing compulsory subjects with credit grade: {missing_compulsory}."
        )
      if jamb_score < 180:
        flags.append(
          f"INSUFFICIENT JAMB SCORE: {jamb_score} is below the 180 minimum. "
          "Status must be 'fixable' and suggested_courses must be empty."
        )
      flags_block = "\n".join(f"  ⚠ {f}" for f in flags) if flags else "  ✓ O'Level credits and JAMB score meet baseline requirements."

      return f"""
        You are a Nigerian university admissions eligibility advisor (JAMB/WAEC system).
        Your job is to evaluate whether a student can gain admission to their desired course
        and institution, and to give actionable, specific guidance.

        ================
        ADMISSION RULES
        ================
        1. O'Level: minimum 5 credits (A1–C6), MUST include English Language and Mathematics.
        2. O'Level sittings: maximum {o_level_sittings} sitting(s) are accepted by this institution.
        3. JAMB: minimum score of 180; competitive courses (Medicine, Law, Engineering) typically
          require 200+.
        4. JAMB subjects must match the standard combination for the desired course.
        5. If a subject appears in both sittings, only the BEST grade counts (no double-counting).

        ================
        PRE-COMPUTED FLAGS (treat these as ground truth)
        ================
        {flags_block}

        Detected credit subjects: {credit_list}
        Total unique credits: {credit_report['total_credits']}

        ================
        STUDENT PROFILE
        ================
        Institution  : {institution_name}
        Desired Course: {desired_course}

        O'Level Results ({o_level_sittings} sitting(s)):
        {o_level_results_combined}

        JAMB Score   : {jamb_score}
        JAMB Subjects: {jamb_subjects}

        ================
        EVALUATION INSTRUCTIONS
        ================
        Step 1 — Determine eligibility_status:
          • "eligible"   → credits ≥ 5 (incl. English & Maths) AND JAMB ≥ 180
                          AND JAMB subjects match the course.
          • "fixable"    → one or more issues exist but can be resolved by retaking
                          exams or adjusting subjects.
          • "not_viable" → issues that cannot realistically be fixed (e.g., age limit,
                          course not offered at institution).

        Step 2 — Populate reasons[]:
          List every specific reason the student is or isn't eligible.
          Reference actual subjects and scores. Be concrete, not generic.

        Step 3 — Populate missing_requirements[]:
          List only items the student still needs (e.g., "Credit in Mathematics",
          "JAMB score of at least 180"). Leave empty if fully eligible.

        Step 4 — Populate recommended_actions[]:
          Give specific, numbered, actionable steps the student should take.
          Always present even if eligible (e.g., "Apply before deadline", "Check
          post-UTME cut-off for {institution_name}").

        Step 5 — Populate suggested_courses[]:
          ONLY populate if credits ≥ 5 AND JAMB ≥ 180.
          Suggest 2–4 related courses at the same institution that the student's
          current profile supports. Leave as [] otherwise.

        Step 6 — JAMB subject check:
          Compare the student's JAMB subjects against the standard Nigerian JAMB
          combination for "{desired_course}". Flag any mismatch clearly in reasons[].

        ================
        HARD CONSTRAINTS (never violate these)
        ================
        - If pre-computed flags show INSUFFICIENT credits or INSUFFICIENT JAMB:
            - eligibility_status MUST be "fixable"
            - is_eligible MUST be false
            - suggested_courses MUST be []
        - Never invent grades or subjects not present in the student's data.
        - Do not use generic advice — reference the student's actual subjects and score.

        ================
        OUTPUT — return ONLY valid JSON, no markdown, no explanation
        ================
        {{
          "eligibility_status": "eligible" | "fixable" | "not_viable",
          "is_eligible": boolean,
          "reasons": string[],
          "missing_requirements": string[],
          "recommended_actions": string[],
          "suggested_courses": string[],
          "o_level_credits_required": 5,
          "o_level_sittings_accepted": {o_level_sittings},
          "jamb_subject_match": boolean,
          "jamb_subject_issues": string[]
        }}
      """

  #  Main handler 
  def post(self, request, *args, **kwargs):
      serializer = EligibilityCheckRequestSerializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      data = serializer.validated_data

      institution_name  = data["institution_name"]
      desired_course    = data["desired_course"]
      o_level_sittings  = int(data["o_level_sittings"])   # normalise to int
      sitting1_text     = data["o_level_sitting_1"]
      sitting2_text     = data.get("o_level_sitting_2", "") or ""
      jamb_score        = int(data["jamb_score"])
      raw_jamb_subjects = data["jamb_subjects"]

      # Normalise JAMB subjects to clean comma-separated string
      if isinstance(raw_jamb_subjects, list):
          jamb_subjects = ", ".join(s.strip() for s in raw_jamb_subjects if s.strip())
      else:
          jamb_subjects = ", ".join(s.strip() for s in raw_jamb_subjects.split(",") if s.strip())

      use_two_sittings = o_level_sittings == 2 and bool(sitting2_text)

      #  Deterministic credit analysis (source of truth) ─
      credit_report = self._analyse_credits(sitting1_text, sitting2_text, use_two_sittings)
      has_min_credits = credit_report["has_min_credits"]
      has_valid_jamb  = jamb_score >= 180

      #  Build O'Level display block for prompt 
      o_level_display = f"1st Sitting: {sitting1_text}"
      if use_two_sittings:
          o_level_display += f"\n2nd Sitting: {sitting2_text}"

      #  Build prompt 
      prompt = self._build_prompt(
          institution_name=institution_name,
          desired_course=desired_course,
          o_level_sittings=o_level_sittings,
          o_level_results_combined=o_level_display,
          jamb_score=jamb_score,
          jamb_subjects=jamb_subjects,
          credit_report=credit_report,
      )

      #  Call Gemini ─
      try:
          response = model.generate_content(
              contents=[{"parts": [{"text": prompt}]}],
              generation_config={
                  "response_mime_type": "application/json",
                  "response_schema": {
                      "type": "OBJECT",
                      "properties": {
                          "eligibility_status":       {"type": "STRING"},
                          "is_eligible":              {"type": "BOOLEAN"},
                          "reasons":                  {"type": "ARRAY", "items": {"type": "STRING"}},
                          "missing_requirements":     {"type": "ARRAY", "items": {"type": "STRING"}},
                          "recommended_actions":      {"type": "ARRAY", "items": {"type": "STRING"}},
                          "suggested_courses":        {"type": "ARRAY", "items": {"type": "STRING"}},
                          "o_level_credits_required": {"type": "NUMBER"},
                          "o_level_sittings_accepted":{"type": "NUMBER"},
                          "jamb_subject_match":       {"type": "BOOLEAN"},
                          "jamb_subject_issues":      {"type": "ARRAY", "items": {"type": "STRING"}},
                      },
                      "required": [
                          "eligibility_status", "is_eligible", "reasons",
                          "missing_requirements", "recommended_actions",
                          "suggested_courses", "jamb_subject_match", "jamb_subject_issues",
                      ],
                  },
              },
          )

          result = json.loads(response.text)

      except json.JSONDecodeError as e:
          return Response(
              {"detail": f"AI returned malformed JSON: {e}"},
              status=status.HTTP_502_BAD_GATEWAY,
          )
      except Exception as e:
          return Response(
              {"detail": f"AI service error: {e}"},
              status=status.HTTP_502_BAD_GATEWAY,
          )

      #  Hard enforcement — override anything the AI got wrong ─
      actions: list[str] = list(result.get("recommended_actions") or [])
      missing: list[str] = list(result.get("missing_requirements") or [])

      if not has_min_credits:
          credits_have = credit_report["total_credits"]
          missing_comp = credit_report["missing_compulsory"]

          missing_items = [f"At least 5 O'Level credits including English and Mathematics (you have {credits_have})"]
          if missing_comp:
              missing_items.append(f"Credit grade in: {', '.join(s.title() for s in missing_comp)}")

          missing = list(set(missing + missing_items))
          actions.append(
              f"Retake WAEC/NECO to obtain at least 5 credits (A1–C6) including English and Mathematics. "
              f"You currently have {credits_have} valid credit(s)."
              + (f" You are missing a credit in: {', '.join(s.title() for s in missing_comp)}." if missing_comp else "")
          )

      if not has_valid_jamb:
          missing.append(f"JAMB score of at least 180 (you scored {jamb_score})")
          actions.append(
              f"Rewrite JAMB. Your current score of {jamb_score} is below the minimum of 180. "
              "Competitive courses like Medicine or Engineering require 200+."
          )

      if not (has_min_credits and has_valid_jamb):
          result["eligibility_status"] = "fixable"
          result["is_eligible"]        = False
          result["suggested_courses"]  = []   # final hard clear — no courses if not qualified

      # Deduplicate & write back
      result["recommended_actions"]  = list(dict.fromkeys(actions))   # preserves order, removes dupes
      result["missing_requirements"] = list(dict.fromkeys(missing))

      # Guarantee all array fields exist
      for field in ("reasons", "jamb_subject_issues"):
          result.setdefault(field, [])

      return Response(result, status=status.HTTP_200_OK)
        
# Chatbot View
class ChatbotAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  MAX_HISTORY_TURNS = 20      # max messages sent to Gemini (keep even so pairs stay intact)
  MAX_MESSAGE_LENGTH = 2000   # characters

  SYSTEM_INSTRUCTION = (
    "You are an AI assistant specialized in Nigerian university admissions. "
    "Your sole purpose is to provide information and guidance related to the admission processes "
    "of universities and other tertiary institutions in Nigeria. "
    "Do not engage in conversations outside of this topic. If a user asks about something else, "
    "politely state that you can only assist with Nigerian admission-related questions."
    "\n\n**IMPORTANT: Format your response using Markdown for easy readability.**"
  )

  ERROR_MAP = {
    "unexpected keyword argument 'system_instruction'": (
        "We're having trouble with our AI assistant. Please try your message again."
    ),
    "400 please use a valid role": (
        "There was an issue with the conversation format. Let's start fresh!"
    ),
    "connection refused": (
        "It looks like the server is busy. Please give it a minute and try again."
    ),
    "invalid request": (
        "Sorry, I can't process that request. Could you rephrase your question?"
    ),
    "response was blocked": (
        "I'm unable to respond to that message. Please rephrase or ask something else."
    ),
  }

  def _get_user_friendly_error(self, error: Exception) -> str:
    lowered = str(error).lower()
    for key, message in self.ERROR_MAP.items():
      if key in lowered:
        return message
    return "An unexpected error occurred. Please try again later."

  def post(self, request, *args, **kwargs):
    serializer = ChatbotRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Extract and validate the latest user message from the frontend payload
    latest_user_message = serializer.validated_data['chat_history'][-1]['parts'][0]['text']

    # Guard: message length
    if len(latest_user_message) > self.MAX_MESSAGE_LENGTH:
      return Response(
        {"detail": f"Message is too long. Please keep it under {self.MAX_MESSAGE_LENGTH} characters."},
        status=status.HTTP_400_BAD_REQUEST,
      )

    # Save the user's message to the database
    user_message_obj = ChatHistory.objects.create(
      user=request.user,
      role='user',
      message=latest_user_message,
    )

    # Fetch history from DB (source of truth), limited to avoid context window overflow
    chat_objects = list(
      ChatHistory.objects.filter(user=request.user)
      .order_by('timestamp')
    )
    # Trim to last MAX_HISTORY_TURNS messages, keeping turn pairs intact
    if len(chat_objects) > self.MAX_HISTORY_TURNS:
      chat_objects = chat_objects[-self.MAX_HISTORY_TURNS:]

    # Build Gemini-format history
    gemini_chat_history = [
      {
        "role": "model" if obj.role == "bot" else obj.role,
        "parts": [{"text": obj.message}],
      }
      for obj in chat_objects
    ]

    # Inject system instruction as fake user/model turn
    system_instruction_text = (
        "You are an AI assistant specialized in Nigerian university admissions. "
        "Your sole purpose is to provide information and guidance related to the admission processes "
        "of universities and other tertiary institutions in Nigeria. "
        "Do not engage in conversations outside of this topic. If a user asks about something else, "
        "politely state that you can only assist with Nigerian admission-related questions."
        "\n\n**IMPORTANT: Format your response using Markdown for easy readability.**"
    )
    full_contents = [
        {"role": "user",  "parts": [{"text": system_instruction_text}]},
        {"role": "model", "parts": [{"text": "Understood. I will only assist with Nigerian university admissions."}]},
    ] + gemini_chat_history

    try:
      response = model.generate_content(
        contents=full_contents
      )

      # Explicit check for blocked / incomplete responses before accessing .text
      candidate = response.candidates[0] if response.candidates else None
      if not candidate or candidate.finish_reason not in ("STOP", 1):
        finish = candidate.finish_reason if candidate else "NO_CANDIDATE"
        raise ValueError(f"response was blocked or incomplete (finish_reason={finish})")

      bot_reply = response.text

      # Save model reply
      ChatHistory.objects.create(
        user=request.user,
        role='model',
        message=bot_reply,
      )

      return Response({"bot_reply": bot_reply}, status=status.HTTP_200_OK)

    except Exception as e:
      # Roll back the user message so history stays consistent
      user_message_obj.delete()

      print(f"Error calling Gemini API for chatbot: {e}")
      return Response(
          {"detail": self._get_user_friendly_error(e)},
          status=status.HTTP_500_INTERNAL_SERVER_ERROR,
      )
  
class ChatHistoryAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  
  def get(self, request, *args, **kwargs):
    history = ChatHistory.objects.filter(user=request.user).order_by('timestamp')
    
    formatted_history = [
      {"role": obj.role, "parts": [{"text": obj.message}]}
      for obj in history
    ]
    
    return Response(formatted_history, status=status.HTTP_200_OK)