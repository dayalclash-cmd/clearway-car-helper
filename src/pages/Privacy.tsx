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

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Clearway Car Hire</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Clearway Car Hire respects your privacy and is committed to protecting any personal information you provide when using our website.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Information We Collect</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            When you contact us through our website, email, or phone, we may collect the following information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 pl-2">
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Travel dates and location details</li>
            <li>Any other information you provide in your enquiry</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We only collect information necessary to respond to your enquiry and provide our services.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">How We Use Your Information</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 pl-2">
            <li>Respond to your enquiries</li>
            <li>Help you find suitable car hire options</li>
            <li>Communicate with you about your request</li>
            <li>Improve our website and services</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We will not sell or rent your personal information to third parties.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Sharing Your Information</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            In some cases, we may share relevant information with trusted car hire providers in order to obtain quotes or arrange bookings on your behalf.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We only share the information necessary to provide the requested service.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Data Security</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            We take reasonable steps to protect your personal information from loss, misuse, or unauthorised access.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            However, no internet transmission is completely secure and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Cookies</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Our website may use cookies or basic analytics tools to help improve user experience and understand how visitors use the site.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Cookies are small files stored on your device that help websites function properly.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            You can disable cookies in your browser settings if you prefer.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Your Rights</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Under applicable data protection laws, including the General Data Protection Regulation (GDPR), you have the right to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 pl-2">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            To make a request, please contact us using the details below.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Contact Us</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or how your information is handled, please contact us:
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Clearway Car Hire<br />
            Email:{" "}
            <a href="mailto:alan@clearwaycarhire.ie" className="text-primary hover:text-primary-dark transition-colors duration-300">
              alan@clearwaycarhire.ie
            </a><br />
            Phone:{" "}
            <a href="tel:+353879769694" className="text-primary hover:text-primary-dark transition-colors duration-300">
              00353 87 9769694
            </a>
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Changes to This Policy</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We may update this Privacy Policy from time to time. Any updates will be posted on this page.
          </p>
        </div>
      </section>
    </>
  );
};

export default Privacy;
