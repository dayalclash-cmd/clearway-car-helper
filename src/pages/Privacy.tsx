import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy — Clearway Car Hire"
        description="How Clearway Car Hire collects, uses, and protects your personal information."
        path="/privacy"
      />

      <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">
            Privacy Policy
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Clearway Car Hire respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the information you provide to us.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Information We Collect</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            When you contact us or submit an enquiry, we may collect the following information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8 pl-2">
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Travel dates and location details</li>
            <li>Any other information you provide in your enquiry</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">How We Use Your Information</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            We use the information you provide to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8 pl-2">
            <li>Respond to your enquiries</li>
            <li>Help you find suitable car hire options</li>
            <li>Communicate with you about your request</li>
            <li>Improve our website and services</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Sharing Your Information</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We do not sell, trade, or rent your personal information to third parties. We may share relevant details with car rental providers only when necessary to fulfil your enquiry, and only with your knowledge.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Data Security</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We take reasonable steps to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Cookies</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Our website may use cookies to improve your browsing experience. Cookies are small files stored on your device that help us understand how you use our site. You can disable cookies in your browser settings at any time.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Your Rights</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8 pl-2">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            To exercise any of these rights, please contact us using the details below.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Contact Us</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:alan@clearwaycarhire.ie" className="text-primary hover:text-primary-dark transition-colors duration-300">
              alan@clearwaycarhire.ie
            </a>{" "}
            or call{" "}
            <a href="tel:+353879769694" className="text-primary hover:text-primary-dark transition-colors duration-300">
              00353 87 9769694
            </a>.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Changes to This Policy</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page. We encourage you to review this policy periodically.
          </p>
        </div>
      </section>
    </>
  );
};

export default Privacy;
