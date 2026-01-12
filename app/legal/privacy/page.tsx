import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Sky Limit Travels',
  description: 'Learn how Sky Limit Travels collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">
          Last updated: 30 June 2024
        </p>
      </div>

      <div className="prose prose-blue max-w-none">
        <p>
          At Sky Limit Travels, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you:
        </p>
        <ul>
          <li>Register on our website</li>
          <li>Make a booking or enquiry</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact us through our website, email, or phone</li>
        </ul>

        <p>
          The personal information we may collect includes:
        </p>
        <ul>
          <li>Name, email address, postal address, and phone number</li>
          <li>Passport details and other identification documents</li>
          <li>Payment information</li>
          <li>Travel preferences and special requirements</li>
          <li>Dietary restrictions or health information necessary for your travel</li>
        </ul>

        <p>
          We also collect certain information automatically when you visit our website, including:
        </p>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Pages you view</li>
          <li>Time and date of your visit</li>
          <li>Referring website or source</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes, including to:
        </p>
        <ul>
          <li>Process and manage your travel bookings</li>
          <li>Communicate with you about your bookings and enquiries</li>
          <li>Provide customer support</li>
          <li>Send you marketing communications (if you've opted in)</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
          <li>Detect and prevent fraud</li>
        </ul>

        <h2>3. Legal Basis for Processing</h2>
        <p>
          We process your personal information based on the following legal grounds:
        </p>
        <ul>
          <li><strong>Contractual necessity</strong>: To fulfil our contractual obligations to you when you book travel services</li>
          <li><strong>Legitimate interests</strong>: To improve our services, prevent fraud, and for direct marketing (where appropriate)</li>
          <li><strong>Consent</strong>: Where you have explicitly consented to the processing of your data</li>
          <li><strong>Legal obligation</strong>: To comply with legal requirements</li>
        </ul>

        <h2>4. Sharing Your Information</h2>
        <p>
          We may share your personal information with:
        </p>
        <ul>
          <li>Travel suppliers (airlines, hotels, tour operators, etc.) to fulfil your booking</li>
          <li>Payment processors to process your payments</li>
          <li>Service providers who help us operate our business</li>
          <li>Government authorities when required by law</li>
        </ul>

        <p>
          We do not sell your personal information to third parties.
        </p>

        <h2>5. International Transfers</h2>
        <p>
          As a travel agency, we may transfer your information to countries outside the UK and European Economic Area (EEA) to fulfil your travel arrangements. When we do so, we ensure appropriate safeguards are in place to protect your information.
        </p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, and destruction. However, no internet-based site can be 100% secure, so we cannot guarantee the absolute security of your information.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We keep your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. The criteria used to determine our retention periods include:
        </p>
        <ul>
          <li>The length of time we have an ongoing relationship with you</li>
          <li>Whether there is a legal obligation to which we are subject</li>
          <li>Whether retention is advisable in light of our legal position (such as for statutes of limitations)</li>
        </ul>

        <h2>8. Cookies and Similar Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect and use information about you. For more information about our use of cookies, please see our <Link href="/legal/cookies" className="text-blue-600 hover:text-blue-800 underline">Cookie Policy</Link>.
        </p>

        <h2>9. Your Rights</h2>
        <p>
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul>
          <li>Right to access your personal information</li>
          <li>Right to rectify inaccurate information</li>
          <li>Right to erasure of your information in certain circumstances</li>
          <li>Right to restrict processing in certain circumstances</li>
          <li>Right to data portability</li>
          <li>Right to object to processing based on legitimate interests</li>
          <li>Right to withdraw consent at any time</li>
          <li>Right to lodge a complaint with a supervisory authority</li>
        </ul>

        <p>
          To exercise any of these rights, please contact us using the details provided below.
        </p>

        <h2>10. Marketing Communications</h2>
        <p>
          We may send you marketing communications about our services, special offers, and promotions if you have given us your consent or if we have a legitimate interest to do so. You can opt out of receiving marketing communications at any time by:
        </p>
        <ul>
          <li>Clicking the "unsubscribe" link in any marketing email</li>
          <li>Contacting us directly</li>
        </ul>

        <h2>11. Children's Privacy</h2>
        <p>
          Our website and services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        </p>

        <h2>12. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to read the privacy policies of any third-party websites you visit.
        </p>

        <h2>13. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will post the updated Privacy Policy on our website with a new effective date.
        </p>

        <h2>14. Contact Us</h2>
        <p className="mt-6 text-gray-700">
          If you have any questions about this Privacy Policy, please contact our Data Protection Team at:
        </p>
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-gray-700 mb-1">Email: <a href="mailto:Flightbookings@skylimittravels.co.uk" className="text-blue-700 hover:text-blue-900">Flightbookings@skylimittravels.co.uk</a></p>
          <p className="text-gray-700">Phone: 03330384142</p>
          <p className="text-gray-700">Address: 61A Blagden St, Sheffield S2 5QS</p>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <Link href="/legal" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Legal Information
          </Link>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
} 