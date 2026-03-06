import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <>
      <SEO
        title="Terms & Conditions — Clearway Car Hire"
        description="Terms and conditions for using the Clearway Car Hire website."
        path="/terms"
      />

      <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">
            Terms & Conditions
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Clearway Car Hire. These Terms & Conditions govern your use of the Clearway Car Hire website and the services we provide. By using our website or engaging our services, you agree to be bound by these terms.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">About Our Service</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Clearway Car Hire is an independent car hire consultancy service. We help customers find suitable car hire options in Ireland by searching and comparing options from trusted rental providers. We are not a car rental company and do not own or operate any rental vehicles.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Booking Enquiries</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            When you submit an enquiry through our website or contact us directly, we will use the information you provide to search for suitable car hire options. Submitting an enquiry does not constitute a booking or a contract. Any booking you make will be directly with the rental provider, subject to their own terms and conditions.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Rental Agreements</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            All car hire bookings are made directly between you and the rental provider. Clearway Car Hire is not a party to any rental agreement. You are responsible for reading and understanding the rental provider's terms and conditions, including their cancellation, insurance, fuel, and deposit policies.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Information Accuracy</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We make every effort to provide accurate and up-to-date information. However, prices, availability, and rental terms are subject to change by the rental providers at any time. We cannot guarantee the accuracy of third-party information.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Liability</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Clearway Car Hire acts as an advisory service only. We are not liable for any issues arising from your rental agreement with a third-party provider, including but not limited to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8 pl-2">
            <li>Vehicle condition</li>
            <li>Rental provider policies</li>
            <li>Insurance coverage</li>
            <li>Vehicle availability</li>
            <li>Any disputes between the customer and the rental provider</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Website Use</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            You may use this website for personal, non-commercial purposes only. You must not misuse this website by introducing viruses, attempting to gain unauthorised access, or using it in any way that could damage or impair its performance.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Privacy</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Your privacy is important to us. Please refer to our Privacy Policy for details on how we collect, use, and protect your personal information.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Changes to Terms</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            We may update these Terms & Conditions from time to time. Any changes will be posted on this page. Continued use of our website or services after changes are posted constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Contact Information</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            If you have any questions about these Terms & Conditions, please contact us at{" "}
            <a href="mailto:alan@clearwaycarhire.ie" className="text-primary hover:text-primary-dark transition-colors duration-300">
              alan@clearwaycarhire.ie
            </a>{" "}
            or call{" "}
            <a href="tel:+353879769694" className="text-primary hover:text-primary-dark transition-colors duration-300">
              00353 87 9769694
            </a>.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Third-Party Service Disclaimer</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Clearway Car Hire may recommend or refer you to third-party car rental providers. These recommendations are based on our experience and research, but we do not endorse or guarantee the services of any third-party provider. Any transactions you enter into with third-party providers are solely between you and that provider.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">Availability and Pricing Disclaimer</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            All car hire options, prices, and availability are subject to change without notice. Clearway Car Hire does not control pricing or availability and cannot guarantee that any specific vehicle, rate, or offer will be available at the time of booking.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">No Guarantee of Service</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            While we strive to provide helpful and accurate advice, Clearway Car Hire does not guarantee the outcome of any car hire arrangement. Our service is advisory in nature, and the final decision on any booking rests with the customer.
          </p>
        </div>
      </section>
    </>
  );
};

export default Terms;
