import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, AlertTriangle } from 'lucide-react';

const PrivacyPolicyPage = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-6 mb-8">
            <Lock className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Privacy Policy
            </h1>
          </div>

          {/* Last Updated Section */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <FileText className="h-4 w-4 mr-2" />
            <span>Last Updated: April 21, 2025</span>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              PLATLAS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our Platform, including any data, content, features, services, or applications we offer.
            </p>
            <p className="text-gray-600 mb-4">
              We understand the sensitive nature of genomic data and are committed to maintaining the highest standards of data protection. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-600 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Register for an account</li>
              <li>Express an interest in obtaining information about us or our Platform</li>
              <li>Participate in activities on the Platform</li>
              <li>Contact us with inquiries or feedback</li>
            </ul>
            <p className="text-gray-600 mt-4 mb-4">
              Personal information may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Institutional affiliation</li>
              <li>Professional information</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.2 Research and Genomic Data</h3>
            <p className="text-gray-600 mb-4">
              Our Platform provides access to genomic research data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Genetic variant information (SNPs)</li>
              <li>Phenotype data</li>
              <li>Population-level genetic association statistics</li>
              <li>Genomic metadata</li>
            </ul>
            <p className="text-gray-600 mt-4 mb-4">
              Most genomic data available through our Platform is aggregated and de-identified population-level data that does not contain personally identifiable information.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.3 Usage Data</h3>
            <p className="text-gray-600 mb-4">
              We automatically collect certain information when you visit, use, or navigate the Platform. This information may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Device and connection information (such as IP address, browser type, operating system)</li>
              <li>Usage patterns (pages viewed, time spent on pages, referring URLs)</li>
              <li>Search queries and filter selections</li>
              <li>Time and date of your visit</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide, operate, and maintain our Platform</li>
              <li>Improve, personalize, and expand our Platform</li>
              <li>Understand and analyze how you use our Platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you about updates, security alerts, and support</li>
              <li>Process transactions and send related information</li>
              <li>Find and prevent fraud or other harmful activities</li>
              <li>Respond to law enforcement requests and as required by applicable law, court order, or governmental regulations</li>
            </ul>
            <p className="text-gray-600 mt-4 mb-4">
              We may use aggregated, anonymized data for research purposes, platform improvements, and to advance scientific knowledge. This data will not contain personally identifiable information.
            </p>
          </section>

          {/* Sharing Your Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Sharing Your Information</h2>
            <p className="text-gray-600 mb-4">
              We may share information in the following situations:
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.1 With Your Consent</h3>
            <p className="text-gray-600 mb-4">
              We may disclose your information with your consent for specific purposes.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.2 With Service Providers</h3>
            <p className="text-gray-600 mb-4">
              We may share your information with service providers to perform services for us or on our behalf, such as data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.3 For Research Collaboration</h3>
            <p className="text-gray-600 mb-4">
              We may share aggregated, de-identified data with research collaborators to advance scientific knowledge and improve our Platform. Any such data will not contain personally identifiable information.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.4 For Business Transfers</h3>
            <p className="text-gray-600 mb-4">
              We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.5 With Affiliates</h3>
            <p className="text-gray-600 mb-4">
              We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.6 To Comply With Laws</h3>
            <p className="text-gray-600 mb-4">
              We may disclose your information where required to do so by law or subpoena or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">4.7 To Protect Rights</h3>
            <p className="text-gray-600 mb-4">
              We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person, or as evidence in litigation.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
            <p className="text-gray-600 mb-4">
              We employ the following data protection measures:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Encryption of data in transit using TLS</li>
              <li>Secure storage of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular backups</li>
            </ul>
          </section>

          {/* Cookies and Tracking Technologies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We may use cookies and similar tracking technologies to collect and store your information. Cookies are small data files that are placed on your computer or mobile device when you visit a website. We use cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Enable certain functions of the Platform</li>
              <li>Provide analytics</li>
              <li>Store your preferences</li>
              <li>Enable advertisements delivery, including behavioral advertising</li>
            </ul>
            <p className="text-gray-600 mt-4 mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
            <p className="text-gray-600 mb-4">
              Usage data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Platform, or we are legally obligated to retain this data for longer periods.
            </p>
          </section>

          {/* Your Data Protection Rights */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Your Data Protection Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Right to Access</h3>
                <p className="text-blue-700">
                  You may request copies of your personal information. We may require you to provide proof of your identity.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Right to Rectification</h3>
                <p className="text-blue-700">
                  You may request that we correct inaccurate or incomplete information about you.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Right to Erasure</h3>
                <p className="text-blue-700">
                  You may request that we delete your personal information in certain circumstances.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Right to Restrict Processing</h3>
                <p className="text-blue-700">
                  You may request that we limit the processing of your information in certain circumstances.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Right to Data Portability</h3>
                <p className="text-blue-700">
                  You may request to obtain a copy of your information in a structured, commonly used, machine-readable format.
                </p>
              </div>
            </div>

            <p className="text-gray-600 mt-6 mb-4">
              To exercise any of these rights, please contact us using the contact information provided below. We will respond to your request within a reasonable timeframe.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our Platform is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
            </p>
            <p className="text-gray-600 mb-4">
              If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-600 mb-4">
              Our Platform may contain links to third-party websites and applications of interest, including advertisements and external services that are not affiliated with us. Once you have used these links to leave our Platform, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
            </p>
            <p className="text-gray-600 mb-4">
              Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. International Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your information, including personal information, may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
            </p>
            <p className="text-gray-600 mb-4">
              If you are located outside the United States and choose to provide information to us, please note that we transfer the information, including personal information, to the United States and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <p className="text-yellow-800">
                  We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your personal information will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Policy Changes */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Privacy Policy Changes</h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p className="text-gray-600 mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions or comments about this Privacy Policy, the ways in which we collect and use your information, your choices and rights regarding such use, or wish to exercise your rights, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">PLATLAS Team</p>
              <p className="text-gray-700">Email: privacy@platlas.org</p>
            </div>
          </section>
          
          {/* Compliance Statement */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">14. Compliance With Genomic Data Regulations</h2>
            <p className="text-gray-600 mb-4">
              PLATLAS is committed to complying with all applicable laws and regulations governing the collection, use, and sharing of genomic data, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>The Genetic Information Nondiscrimination Act (GINA)</li>
              <li>The Health Insurance Portability and Accountability Act (HIPAA), where applicable</li>
              <li>The General Data Protection Regulation (GDPR) for users in the European Union</li>
              <li>The California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) for California residents</li>
              <li>Other state, federal, and international laws regarding genetic data privacy</li>
            </ul>
            <p className="text-gray-600 mt-4">
              We strive to maintain the highest ethical standards in genomic data management and research. Our Platform is designed to support responsible genomic research while protecting individual privacy rights.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center space-x-6 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            Return to Home
          </Link>
          <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;