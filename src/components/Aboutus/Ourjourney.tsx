// app/components/OurJourney.tsx

export default function OurJourney() {
  return (
    <section className="px-6 md:px-24 py-16 bg-white text-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left Heading */}
        <div className="md:w-1/3">
          <h2 className="text-4xl md:text-5xl font-serif">Our Journey</h2>
        </div>

        {/* Right Content */}
        <div className="md:w-2/3 space-y-6 text-base md:text-lg leading-relaxed font-light">
          <p>
            HotelFirst was founded with a clear purpose: to bridge the gap
            between hotel ownership and operational excellence through
            intelligent, independent advisory.
          </p>
          <p>
            Our story began with the vision of Akshay, whose career has been
            defined by a deep understanding of the hospitality ecosystem, not
            just from boardrooms and balance sheets, but from the ground up.
            Having worked closely with hotel owners, developers, and global
            brands across India, he observed a recurring challenge: the lack of
            a truly owner-aligned consulting partner who could blend strategic
            insight with operational depth.
          </p>
          <p>
            Drawing from this experience, HotelFirst was established as a
            boutique advisory firm built on three core principles: clarity in
            decision making, discipline in execution, and integrity in
            representation. From brand selection and asset management to audits,
            turnarounds, and feasibility studies, our journey has always been
            about helping owners make smarter, faster, and more confident
            choices.
          </p>
          <p>
            Today, HotelFirst operates with a selective mandate philosophy,
            working with a limited number of clients at any given time to ensure
            each engagement receives the focus, senior leadership, and custom
            strategy it deserves. We don&rsquo;t just advise from the sidelines.
            We represent, realign, and re calibrate, always with the
            owner&rsquo;s lens in mind.
          </p>
          <p>
            What began as a founder led initiative has grown into a trusted
            practice known for its intelligence, discretion, and results. And
            while the markets we serve may evolve, our role remains constant: to
            protect and enhance the value of every asset we&rsquo;re entrusted
            with.
          </p>
        </div>
      </div>
    </section>
  );
}
