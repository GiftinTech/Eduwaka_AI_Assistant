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
      <div
        className={`absolute bottom-[82%] left-0 h-[25%] w-full bg-[image:var(--mobile-bg)] bg-contain bg-no-repeat sm:bottom-[99%] sm:h-[42%] sm:bg-cover md:bg-[image:var(--desktop-bg)]`}
      ></div>
      <section className="sm:pl-[10%]">
        <h1 className="mt-0 text-xl font-bold">
          Email Notifications/Updates on Schools
        </h1>
        <p className="pr-[30%]">
          Subscribe to receive timely email updates on admission news,
          deadlines, and important announcements from your preferred
          institutions. We’ll never send you spam or pass on your email address
        </p>
        <form className="mt-4 sm:max-sm:flex sm:max-sm:flex-col" action="">
          <input
            className="mt-4 w-full rounded-md border-none p-2 sm:w-[60%]"
            type="email"
            required
          />
          <button
            className={`animate-slide-in-dynamic-x ml-[50%] mt-2 w-1/2 rounded-md bg-[hsl(322,100%,66%)] p-2 font-semibold text-[hsl(207,100%,98%)] transition duration-700 [--tw-slide-from-x:-100%] hover:bg-[hsl(321,100%,78%)] sm:ml-[2%] sm:mt-0 sm:w-[36%] sm:[--tw-slide-from-x:-50%] md:[--tw-slide-from-x:-25%] lg:[--tw-slide-from-x:0] xl:[--tw-slide-from-x:-10%]`}
          >
            Subscribe
          </button>
        </form>
      </section>
      <section className="pr-[10%]">
        <figure className="mb-4 ml-0 mt-[4rem]">
          <img
            className="h-[2rem] w-auto"
            src={eduwakaLogo}
            alt="Eduwaka Logo"
          />
        </figure>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nulla
          quam, hendrerit lacinia vestibulum a, ultrices quis sem.
        </p>
        <ul className="mt-8 list-none p-0" id="data-list1">
          <li>
            <figure className="m-0 flex items-center">
              <IoCall size={24} />
              <figcaption className="ml-4">
                <a
                  href="tel:+1-543-123-4567"
                  className="hover:text-aqua text-[hsl(207,100%,98%)] no-underline"
                >
                  Phone: +1-543-123-4567
                </a>
              </figcaption>
            </figure>
          </li>
          <li>
            <figure className="m-0 flex items-center">
              <IoMail size={24} />
              <figcaption className="ml-4">
                <a
                  href="mailto:example@fylo.com"
                  className="hover:text-aqua text-[hsl(207,100%,98%)] no-underline"
                >
                  example@fylo.com
                </a>
              </figcaption>
            </figure>
          </li>
        </ul>

        <ul className="mt-8 flex list-none p-0" id="data-list2">
          <li className="mx-[2%]">
            <a href="#" className="hover:text-aqua">
              <IoLogoFacebook size={24} />
            </a>
          </li>
          <li className="mx-[2%]">
            <a href="#" className="hover:text-aqua">
              <IoLogoTwitter size={24} />
            </a>
          </li>
          <li className="mx-[2%]">
            <a href="#" className="hover:text-aqua">
              <IoLogoInstagram size={24} />
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default CompanyInformation;
