import Image from "next/image";

interface Props {
  breadcrumb: string;
  title: string;
  overviewTitle: string;
  overviewText: string;
  bannerImage: string;
  resortImage: string;
}

export default function HeroCard({
  breadcrumb,
  title,
  overviewTitle,
  overviewText,
  bannerImage,
  resortImage,
}: Props) {
  return (
    <div className="w-full mt-[5rem]">
      {/* Banner Section */}
      <div className="relative w-full h-[50vh] text-white z-0">
        <Image
          src={bannerImage}
          alt="Hotel Lobby"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-[7.5rem] ">
          <span className="text-white text-sm tracking-wide uppercase">
            {breadcrumb}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mt-2">
            {title}
          </h1>
        </div>
      </div>

      {/* Overview Section */}
      <div className="relative w-full overflow-hidden">
        {/* Orange background on the right half */}
        <div className="hidden md:block absolute top-0 right-0 w-[50vw] h-full bg-[#FEEFEA] z-0" />

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-0 py-20 gap-10 z-10">
          {/* Resort Image */}
          <div className="relative w-max md:w-2/3 h-[400px] rounded-2xl overflow-hidden shadow-md z-10">
            <Image
              src={resortImage}
              alt="Resort"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Floating Card */}
          <div className="bg-white shadow-xl !S left-10 rounded-xl p-8 max-w-md w-full z-20">
            <h2 className="text-2xl font-serif font-semibold text-[#D54F2F] mb-4">
              {overviewTitle}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {overviewText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
