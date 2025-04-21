import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield, FileText } from 'lucide-react';

const TermsOfServicePage = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-6 mb-8">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Terms of Service
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
              Welcome to PLATLAS ("we," "our," or "us"). PLATLAS is a scientific platform designed to facilitate genomic research through data visualization and analysis tools. By accessing or using our website, API, or services (collectively, the "Platform"), you agree to be bound by these Terms of Service ("Terms").
            </p>
            <p className="text-gray-600 mb-4">
              Please read these Terms carefully. If you do not agree with these Terms, you should not access or use our Platform. By accessing or using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>"Content"</strong> refers to all information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials that users submit, upload, post, publish, display, or otherwise make available on or through the Platform.
              </li>
              <li>
                <strong>"User"</strong> refers to any individual or entity that accesses or uses the Platform.
              </li>
              <li>
                <strong>"Genomic Data"</strong> refers to any data related to genetic sequences, gene expression, SNPs, phenotypes, or other genetic or genomic information accessed or processed through the Platform.
              </li>
            </ul>
          </section>

          {/* Account Terms */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Account Terms</h2>
            <p className="text-gray-600 mb-4">
              You may be required to create an account to access certain features of the Platform. When you create an account, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account and password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-600 mt-4">
              We reserve the right to disable any user account at any time, including if you have failed to comply with any of the provisions of these Terms.
            </p>
          </section>

          {/* Platform Use and Restrictions */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Platform Use and Restrictions</h2>
            <p className="text-gray-600 mb-4">
              Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Platform for research and educational purposes. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use the Platform in any way that violates any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to the Platform or its related systems or networks</li>
              <li>Use the Platform to transmit any viruses, malware, or other malicious code</li>
              <li>Interfere with or disrupt the integrity or performance of the Platform</li>
              <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Platform without express written permission from us</li>
              <li>Use automated methods or scripts to scrape or extract data from the Platform</li>
              <li>Use the Platform to re-identify de-identified genetic or health information</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Platform and its original content, features, and functionality are owned by PLATLAS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-600 mb-4">
              You retain ownership of any Content you submit, post, or display on or through the Platform. By submitting, posting, or displaying Content on or through the Platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute such Content for the purpose of providing and improving our Platform.
            </p>
          </section>

          {/* Data Usage and Privacy */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Data Usage and Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your information. By using our Platform, you agree to our collection, use, and sharing of your information as described in our Privacy Policy.
            </p>
            <p className="text-gray-600 mb-4">
              You acknowledge that genomic data may be sensitive and potentially identifiable. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Only upload or access genomic data for which you have appropriate permissions and consent</li>
              <li>Comply with all applicable laws and regulations regarding genetic privacy and research</li>
              <li>Maintain appropriate security measures when handling genomic data obtained through the Platform</li>
            </ul>
          </section>

          {/* Third-Party Links and Services */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Third-Party Links and Services</h2>
            <p className="text-gray-600 mb-4">
              The Platform may contain links to third-party websites or services that are not owned or controlled by PLATLAS. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-gray-600 mb-4">
              You acknowledge and agree that PLATLAS shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
            </p>
            <p className="text-gray-600 mb-4">
              PLATLAS DOES NOT WARRANT THAT (A) THE PLATFORM WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION; (B) ANY ERRORS OR DEFECTS WILL BE CORRECTED; (C) THE PLATFORM IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR (D) THE RESULTS OF USING THE PLATFORM WILL MEET YOUR REQUIREMENTS.
            </p>
            <p className="text-gray-600 mb-4">
              GENOMIC DATA AND ANALYSES PROVIDED THROUGH THE PLATFORM ARE FOR RESEARCH PURPOSES ONLY AND SHOULD NOT BE USED FOR MEDICAL DIAGNOSIS OR TREATMENT DECISIONS WITHOUT APPROPRIATE PROFESSIONAL CONSULTATION.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              IN NO EVENT SHALL PLATLAS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE PLATFORM; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM; (C) ANY CONTENT OBTAINED FROM THE PLATFORM; AND (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 mb-4">
              You agree to defend, indemnify, and hold harmless PLATLAS, its parent, subsidiaries, affiliates, and their respective directors, officers, employees, contractors, agents, suppliers, licensors, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Platform, including, but not limited to, your User Content, any use of the Platform's content, services, and products other than as expressly authorized in these Terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-gray-600 mb-4">
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-600 mb-4">
              By continuing to access or use our Platform after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Platform.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600 mb-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          {/* Complete Agreement */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">14. Complete Agreement</h2>
            <p className="text-gray-600 mb-4">
              These Terms constitute the entire agreement between us regarding our Platform, and supersede and replace any prior agreements we might have had between us regarding the Platform.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">15. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">PLATLAS Team</p>
              <p className="text-gray-700">Email: legal@platlas.org</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center space-x-6 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            Return to Home
          </Link>
          <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;