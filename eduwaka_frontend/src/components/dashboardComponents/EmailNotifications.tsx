import {
  Card,
  InfoBanner,
  Input,
  PageHeader,
  PrimaryButton,
} from './DashboardComponents';

const EmailNotifications = () => (
  <div>
    <PageHeader
      title="Email Notifications"
      subtitle="Subscribe to receive timely updates on admission news, deadlines, and announcements."
    />
    <Card className="space-y-4">
      <Input
        id="notificationEmail"
        label="Your Email"
        type="email"
        placeholder="your_email@example.com"
      />
      <PrimaryButton>Subscribe for Updates</PrimaryButton>
      <InfoBanner>Feature coming soon. This is just an MVP.</InfoBanner>
    </Card>
  </div>
);
export default EmailNotifications;
