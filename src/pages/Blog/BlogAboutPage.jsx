// src/pages/blog/AboutPage.jsx
import { useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Logo from "/UAACAII LOGO.png";

const objectivesEN = [
  "to protect and defend law-abiding citizens from social, political, economic subjection corruption and injustice in Nigeria and world-wide.",
  "to fight corruption and social injustice within the ambit of the law.",
  "to protect and defend the human and civil rights of the lawful citizenry.",
  "to dethrone corruption, social vices and injustice in the Federal Republic of Nigeria and world-wide.",
  "to promote mutual co-operation, assistance and inter-dependence among members.",
  "to enhance the progress and development of members.",
  "to foster the spirit of oneness, collective efforts, peace and unity among members and with the entire mankind.",
  "to do such other lawful things as may be incidental or conducive to the attainment of the aforesaid mandates.",
  "to engage in other lawful activities that are consistent with the rules, practices and of non-governmental, non-political, human/civil rights organizations in Nigeria, and world-wide.",
];

const membershipRulesEN = [
  "Be self-disciplined.",
  "Not have any criminal record or any act capable of reducing the status of the members in public eyes.",
  "Capable of self-sustenance.",
  "Open to any person (Nigerian or foreign) of at least eighteen (18) years.",
  "No person shall be deprived of membership on grounds of sex, religion, political belief, ethnicity or nationality.",
];

const trusteeCeaseEN = [
  "Resigns his office.",
  "Ceases to be a member of the organization.",
  "Becomes insane.",
  "Is officially declared bankrupt.",
  "Is convicted of a criminal offence involving dishonesty by a court of competent jurisdiction.",
  "Is recommended for removal from office by the Board of Governors' and Trustees' majority vote of members present at any general meeting.",
  "Ceases to reside in Nigeria.",
];

const longEnglishText = (
  <>
    <p className="leading-relaxed">
      UNITED ACTION AGAINST CORRUPTION AND INJUSTICE (UAACAI) International is a
      Non-Governmental international, anti-corruption, human rights organization
      duly registered by the Corporate Affairs Commission of the Federal
      Republic of Nigeria (Registration Number CAC/AIT/NO.25796) in compliance
      with the provisions of the Companies And Allied Matters Act, No. 1 of
      1990, Part C, as amended, on the 9th day of November, 2007. The motto of
      this organization is: <strong>To Fight Corruption And Injustice.</strong>
    </p>

    <p className="leading-relaxed mt-4">
      The Organization is a member of the National Anti-Corruption Coalition
      (NACC) and a partner with the Independent Corrupt Practices And Other
      Related Offences Commission (ICPC). It is purely non-governmental,
      non-political and a civil/human rights organization that represents a
      united effort in the sustainable crusade against corruption and injustice
      within Nigeria and beyond.
    </p>

    <h3 className="mt-6 text-xl font-semibold">Mandates & Objectives</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {objectivesEN.map((obj, idx) => (
        <div
          key={idx}
          className="flex gap-3 items-start bg-white/60 p-3 rounded-lg shadow-sm"
        >
          <div className="flex-none w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sky-600">
            {String.fromCharCode(97 + idx) /* a, b, c... */}
          </div>
          <div className="text-sm text-gray-700">{obj}</div>
        </div>
      ))}
    </div>

    <h3 className="mt-6 text-xl font-semibold">Membership</h3>
    <p className="mt-3 leading-relaxed">
      Membership of UAACAI International is absolutely voluntary. Members must
      abide by the constitution of the organization and the following core
      expectations:
    </p>
    <ul className="list-inside list-decimal mt-3 space-y-1 text-gray-700">
      {membershipRulesEN.map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>

    <h3 className="mt-6 text-xl font-semibold">Trustees</h3>
    <p className="mt-3 leading-relaxed">
      Trustees may hold office for life, but a trustee shall cease to hold
      office if any of the following occur:
    </p>
    <ul className="list-disc pl-5 mt-3 text-gray-700 space-y-1">
      {trusteeCeaseEN.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>

    <h3 className="mt-6 text-xl font-semibold">Finance & Property</h3>
    <p className="mt-3 leading-relaxed text-gray-700">
      The income and property of UAACAI International shall be applied solely
      towards promotion of the organization's objects. No portion shall be paid
      or transferred directly or indirectly as dividend, bonus or profit to
      members. Reasonable remuneration for services actually rendered is
      permitted, and trustees shall not hold salaried offices that conflict with
      these rules except as specified in the constitution.
    </p>

    <h3 className="mt-6 text-xl font-semibold">Amendments & Dissolution</h3>
    <p className="mt-3 leading-relaxed text-gray-700">
      No addition or amendment to the constitution shall be made unless
      previously submitted to and approved by the Registrar General, Corporate
      Affairs Commission. In the event of winding up or dissolution, any
      remaining assets after satisfaction of debts and liabilities shall be
      given or transferred to another organization(s) with similar objects, or
      for charitable purposes if necessary.
    </p>
  </>
);

const frenchText = (
  <>
    <p className="leading-relaxed">
      L'Action Unie contre la Corruption et l'Injustice (UAACAI) International
      est une organisation non gouvernementale internationale, d'anticorruption
      et des droits de l'homme officiellement enregistrée par la Commission
      chargée des entreprises de la République Fédérale du Nigeria (Numéro
      d'enregistrement CAC/AIT/NO.25796) en conformité avec les clauses de
      l'Acte des Sociétés et Affaires connexes No. 1 de 1990, Partie C, comme
      amendé, le 9 novembre 2007. La devise est :{" "}
      <strong>Combattre la Corruption et l'Injustice.</strong>
    </p>

    <p className="mt-4 leading-relaxed">
      L'organisation est membre de la Coalition Nationale Anti-Corruption (NACC)
      et partenaire de la Commission Indépendante des Pratiques Corruptives et
      Autres Infractions Connexes (ICPC). Elle est à but non gouvernemental,
      a-politique et se consacre aux droits civiques et humains, agissant au
      Nigeria et au-delà de ses frontières.
    </p>

    <h3 className="mt-6 text-xl font-semibold">Mandats & Objectifs</h3>
    <p className="mt-3 leading-relaxed">
      (Le détail complet des objectifs en français suit la même portée que la
      version anglaise et inclut la protection des citoyens, la lutte contre la
      corruption, la promotion de la coopération mutuelle, et d'autres actions
      légales pour atteindre ces mandats.)
    </p>

    <h3 className="mt-6 text-xl font-semibold">Adhésion & Gouvernance</h3>
    <p className="mt-3 leading-relaxed">
      L'adhésion est volontaire et ouverte à toute personne âgée de 18 ans et
      plus, sans discrimination de sexe, religion, croyance politique, origine
      ethnique ou nationalité. Les administrateurs peuvent être retirés selon
      les procédures prévues dans la constitution.
    </p>

    <h3 className="mt-6 text-xl font-semibold">Finances & Dissolution</h3>
    <p className="mt-3 leading-relaxed">
      Les revenus et la propriété sont utilisés uniquement pour la promotion des
      objectifs de l'organisation. En cas de dissolution, les actifs restants
      seront transférés à des institutions poursuivant des objectifs similaires
      ou à un but caritatif.
    </p>
  </>
);

const AboutPage = () => {
  const [lang, setLang] = useState("en");

  return (
    <BlogLayout activeMenu="About">
      <main className="about-container max-w-7xl mx-auto px-6 py-6">
        {/* Hero */}
        <header className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-linear-to-r from-sky-50 to-white/60 px-6 py-6 rounded-xl shadow-lg">
            <img
              src={Logo}
              alt="UAACAI Logo"
              className="flex-none w-40 sm:w-52 md:w-64 lg:w-112.5 max-w-full h-auto object-contain drop-shadow-2xl"
            />

            {/* text column: allow shrinking with min-w-0 and take remaining space with flex-1 */}
            <div className="text-left flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-4xl font-extrabold leading-tight wrap-break-word">
                United Action Against Corruption &amp; Injustice (UAACAI)
                International
              </h1>

              <p className="mt-2 text-sky-600 font-semibold">
                Motto: To Fight Corruption And Injustice
              </p>

              <div className="mt-3">
                <div className="inline-flex rounded-full bg-sky-100/60 px-3 py-1 text-sm font-medium text-sky-700 shadow-sm whitespace-normal sm:whitespace-nowrap">
                  Registered CAC:
                  <span className="ml-2 font-semibold">CAC/AIT/NO.25796</span>
                </div>
              </div>
            </div>
          </div>

          {/* language toggle */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-2 rounded-md font-medium ${lang === "en" ? "bg-sky-600 text-white" : "bg-white border"}`}
            >
              English
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`px-4 py-2 rounded-md font-medium ${lang === "fr" ? "bg-sky-600 text-white" : "bg-white border"}`}
            >
              Français
            </button>
          </div>
        </header>

        {/* Body Card */}
        <section className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
          <div className="prose max-w-none text-gray-800">
            {lang === "en" ? (
              <>
                {/* Intro + full English content */}
                {longEnglishText}

                <hr className="my-6" />

                <h3 className="text-xl font-semibold">Additional details</h3>
                <p className="mt-3 leading-relaxed text-gray-700">
                  The organization aligns its operations with the Companies and
                  Allied Matters Act and the oversight of the Corporate Affairs
                  Commission. Any amendment must be approved by the Registrar
                  General. Trustees may accept and hold land in trust for the
                  organization subject to Commission conditions.
                </p>

                <details className="mt-4 p-4 bg-sky-50 rounded-md">
                  <summary className="font-semibold cursor-pointer">
                    Full English legal text (expand)
                  </summary>
                  <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                    {/* Insert the long legal text that was in original content (kept concise here to avoid repetition).
                        If you want the exact original paragraphs verbatim, replace this block with them. */}
                    <p>
                      Provided that nothing herein shall prevent the payment, in
                      good faith, of reasonable and proper remuneration to any
                      officer or servant of UAACAI International for services
                      actually rendered, so that no trustee shall be appointed
                      to a salaried office of the organization except as allowed
                      by the constitution. In the event of winding up, any
                      remaining property shall be given or transferred to other
                      institutions with similar objects or to charitable
                      purposes.
                    </p>
                  </div>
                </details>
              </>
            ) : (
              <>
                {/* French summary + key sections (full french text can be placed here) */}
                {frenchText}

                <hr className="my-6" />

                <details className="mt-4 p-4 bg-sky-50 rounded-md">
                  <summary className="font-semibold cursor-pointer">
                    Texte légal complet (ouvrir)
                  </summary>
                  <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                    <p>
                      (La version française complète suit la même logique que la
                      version anglaise et peut être insérée ici en intégralité
                      si vous le souhaitez.)
                    </p>
                  </div>
                </details>
              </>
            )}
          </div>

          {/* Contact / Call to action */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Interested in joining, partnering or supporting UAACAI? Reach
                out through our contact channels listed on this site.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                className="inline-block px-4 py-2 rounded-md bg-sky-600 text-white font-semibold shadow hover:bg-sky-700"
                aria-label="Go to contact page"
              >
                Contact Us
              </a>
              <a
                href="/"
                className="inline-block px-4 py-2 rounded-md border border-sky-600 text-sky-600 font-semibold hover:bg-sky-50"
                aria-label="Support UAACAI"
              >
                Support
              </a>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer className="mt-8 text-center text-xs text-gray-500">
          <p>
            All information shown is a summary of UAACAI International's
            constitution and objectives.
          </p>
        </footer>
      </main>
    </BlogLayout>
  );
};

export default AboutPage;
