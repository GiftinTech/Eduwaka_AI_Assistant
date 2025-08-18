import React from 'react';
import {
  IoCall,
  IoMail,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
} from 'react-icons/io5';

import eduwakaLogo from '../assets/edu_logo.svg';

const CompanyInformation: React.FC = () => {
  return (
    <article className="relative block bg-[hsl(192,100%,9%)] p-[5%] pt-[20%] text-[hsl(207,100%,98%)] sm:flex sm:flex-row-reverse sm:pt-[5%]">
      {/* keep your background untouched */}
      <div
        className={`absolute bottom-[82%] left-0 h-[25%] w-full bg-[image:var(--mobile-bg)] bg-contain bg-no-repeat sm:bottom-[99%] sm:h-[42%] sm:bg-cover md:bg-[image:var(--desktop-bg)]`}
      ></div>

      {/* constrain content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 sm:flex-row-reverse sm:gap-10 lg:ml-20">
        {/* newsletter */}
        <section className="sm:flex-1">
          <h1 className="mt-0 text-xl font-bold">
            Email Notifications / Updates on Schools
          </h1>
          <p className="mt-2 max-w-md">
            Subscribe to receive timely email updates on admission news,
            deadlines, and important announcements from your preferred
            institutions. We’ll never send you spam or pass on your email
            address.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
            action=""
          >
            <input
              className="w-full rounded-md border-none p-3 text-black outline-none sm:w-[65%]"
              type="email"
              placeholder="Enter your email"
              required
            />
            <button
              className={`w-full animate-slide-in-dynamic-x rounded-md bg-[hsl(322,100%,66%)] p-3 font-semibold text-[hsl(207,100%,98%)] transition duration-700 [--tw-slide-from-x:-100%] hover:bg-[hsl(321,100%,78%)] sm:w-auto sm:px-6 sm:[--tw-slide-from-x:-50%] md:[--tw-slide-from-x:-25%] lg:[--tw-slide-from-x:0] xl:[--tw-slide-from-x:-10%]`}
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* company info */}
        <section className="sm:flex-1 lg:-mt-8">
          <figure>
            <img
              className="h-20 w-auto" // was h-8
              src={eduwakaLogo}
              alt="Eduwaka Logo"
            />
          </figure>

          <p className="max-w-md text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            nulla quam, hendrerit lacinia vestibulum a, ultrices quis sem.
          </p>

          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-center">
              <IoCall size={20} />
              <a
                href="tel:+1-543-123-4567"
                className="ml-3 hover:text-[hsl(322,100%,66%)]"
              >
                +234-90-003-566-02
              </a>
            </li>
            <li className="flex items-center">
              <IoMail size={20} />
              <a
                href="mailto:example@fylo.com"
                className="ml-3 hover:text-[hsl(322,100%,66%)]"
              >
                eduwaka@edu.com
              </a>
            </li>
          </ul>

          <ul className="mt-5 flex gap-6">
            <li>
              <a href="#" className="hover:text-[hsl(322,100%,66%)]">
                <IoLogoFacebook size={24} />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[hsl(322,100%,66%)]">
                <IoLogoTwitter size={24} />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[hsl(322,100%,66%)]">
                <IoLogoInstagram size={24} />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
};

export default CompanyInformation;
