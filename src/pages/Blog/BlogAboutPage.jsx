// src/pages/blog/AboutPage.jsx

import React from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";

// import your images (adjust the paths)
import heroCircle1 from "/cover.jpeg";
import heroCircle2 from "/head-cover.jpeg";
import heroCircle3 from "/image.png";

import feature1 from "/cover-7.jpeg";
import feature2 from "/cover-9.jpeg";
import feature3 from "/cover-12.jpeg";
import feature4 from "/cover-13.jpeg";
import feat1 from "/cover-4.jpeg";
import feat2 from "/cover-14.jpeg";
import feat3 from "/cover-5.jpeg";
import feat4 from "/cover-6.jpeg";
import side_img from "/cover-10.jpeg";
import side_img2 from "/cover-3.jpeg";
import { LucideMail } from "lucide-react";
import { LuContact } from "react-icons/lu";

const BlogAboutPage = () => {
  return (
    <BlogLayout activeMenu="About">
      <div className="about-container max-w-6xl mx-auto py-16 px-4 space-y-20">
        {/* Hero section */}
        <section className="hero flex flex-col lg:flex-row items-center gap-8">
          <div className="hero-text flex-1">
            <h1 className="text-4xl font-bold mb-2">About Us</h1>
            <p className="text-gray-600 font-medium">
              United Action Against Corruption and Injustice (UAACAI)
              International is a registered NGO dedicated to uniting communities
              and driving sustainable change in the fight against corruption and
              injustice, both in Nigeria and beyond.
            </p>
          </div>
          <div className="hero-images flex-1 flex space-x-4 justify-center">
            {[heroCircle1, heroCircle2, heroCircle3].map((src, i) => (
              <div
                key={i}
                className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-sky-800 ring-offset-2 ring-offset-white"
              >
                <img src={src} alt="" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </section>

        {/* “Sharing is Caring” section */}
        <section className="sharing flex flex-col lg:flex-row items-start gap-12">
          <div className="sharing-images grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            <img
              src={feature1}
              alt="Office interior"
              className="rounded-lg object-cover w-full h-56"
            />
            <img
              src={feature2}
              alt="Open space"
              className="rounded-lg object-cover w-full h-56"
            />
            <img
              src={feature3}
              alt="Hands helping"
              className="rounded-lg object-cover w-full h-56"
            />
            <img
              src={feature4}
              alt="Meeting room"
              className="rounded-lg object-cover w-full h-56"
            />
          </div>
          <div className="sharing-text flex-1">
            <h2 className="text-xl font-bold mb-4">
              RESUME OF UNITED ACTION AGAINST CORRUPTION,AND INJUSTICE (UAACA)
              INTERNATIONAL
            </h2>
            <p className="text-gray-700 leading-relaxed">
              United Action Against Corruption And Injustice (UAACAI)
              International, is a Non-Governmental international,
              anti-corruption, human rights organization duly registered by the
              Corporate Affairs Commission of the Federal Republic of Nigeria
              (Registration Number CAC/AIT/NO.25796;) in compliance with the
              provisions of the Companies And Allied Matters Act, No.1 of 1990,
              Part C, as amended, on the 9th day of November, 2007. The
              Organization is Member, National Anti-Corruption Coalition (NACC),
              and Partner with the Independent Corrupt Practices And Other
              Related Offences Commission (ICPC). The motto of this organization
              is; To Fight Corruption And Injustice. It is purely
              non-governmental, non-political, civil/human rights organization
              and expressly represents a combined or united forces and efforts
              in enhancing sustainable crusade and war against the malaise of
              all forms of corruption and injustice, both within the Nigerian
              polity as well as beyond the shores of its territorial boundaries.
              Specifically, the mandates of United Action Against Corruption and
              Injustice (UAACAI) International, as enshrined in its legally
              constituted aims and objectives include the following; viz:
            </p>
          </div>
        </section>

        {/* “Endless Possibilities to Share” & Secret of Giving */}
        <section className="possibilities grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              The Secret of Living is Giving
            </h3>
            <p className="text-gray-700 mb-6">
              <strong>a.</strong> to protect and defend law-abiding citizens
              from social, political, economic subjection corruption and
              injustice in Nigeria and world-wide. <br /> <strong>b.</strong> to
              fight corruption and social injustice within the ambit of the law.{" "}
              <br />
              <strong>c.</strong> to protect and defend the human and civil{" "}
              <br />
              <strong>d.</strong> to dethrone corruption, social vices and
              injustice in the Federal Republic of Nigeria and world-wide.{" "}
              <br />
              <strong>e.</strong> to promote mutual co-operation, assistance and
              inter-dependence among members. <br />
              <strong>f.</strong> to enhance the progress and development of
              members. <br />
              <strong>g.</strong> to foster the spirit of oneness, collective
              efforts, peace and unity among members and with the entire
              mankind. <br />
              <strong>h.</strong> to do such other lawful things as may be
              incidental or conducive to the attainment of the aforesaid
              mandates. rights of the lawful citizenry.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[feat1, feat2, feat3, feat4].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="rounded-lg object-cover w-full h-32"
                />
              ))}
            </div>
            <p className="mt-6 text-gray-700">
              <strong>i.</strong> to engage in other lawful activities that are
              consistent with the rules, practices and of non-governmental,
              non-political, human/civil rights organizations in Nigeria, and
              world-wide. The membership of the United Action Against Corruption
              And Injustice (UAACAI) International is absolutely voluntary and
              for those who are interested in the growth of peaceful
              co-existence nationals, but whoever becomes a member voluntarily
              must abide by the constitution of the organization; be self
              disciplined. <br /> <strong>ii.</strong> not have any criminal
              record or not have done any act capable of reducing the status of
              the members of the organization in the eyes of the general public.{" "}
              <br /> <strong>iii.</strong> capable of self sustenance. <br />
              <strong>iv.</strong> membership of the organization shall be open
              to all persons, Nigerian or foreigner, provided the person has
              attained the age of eighteen (18) years. <br />{" "}
              <strong>v.</strong> no person shall be deprived of membership of
              the organization on grounds of sex, religious and political
              beliefs/inclination or ethnic background, or nationality.
            </p>
          </div>
          <div className="feature‑cards flex flex-col space-y-6">
            <img
              src={side_img}
              alt=""
              className="rounded-lg border-8 border-sky-800"
            />
            <img
              src={side_img2}
              alt=""
              className="rounded-lg border-8 border-sky-800"
            />
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h4 className="font-bold mb-2 text-sky-800">Address:</h4>
              <p className="text-sm text-gray-500"></p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Email Us", icon: <LucideMail />, text: "" },
                { title: "Contact Us", icon: <LuContact />, text: "" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white shadow-sm rounded-lg p-4 flex flex-col items-center"
                >
                  <div className="text-2xl text-sky-500 mb-2">{card.icon}</div>
                  <div className="text-sm font-bold text-sky-800">
                    {card.title}
                  </div>
                  <p className="text-xs text-gray-500">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </BlogLayout>
  );
};

export default BlogAboutPage;
