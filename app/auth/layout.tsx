import Logo from "@/components/Logo";
import Image from "next/image";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="lg:hidden">
        <div className="relative h-screen">
          <Image
            src="/image/apartment.jpg"
            alt="bg-img"
            priority
            className="h-screen w-screen"
            width={800}
            height={500}
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md">{children}</div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="flex min-h-screen h-full">
          <div className="w-1/2">
            <Image
              src="/image/apartment.jpg"
              alt="bg-img"
              priority
              className="h-full"
              width={1000}
              height={500}
            />
          </div>
          <div className="w-1/2 p-8 flex flex-col gap-8">
            <div className="w-full flex justify-between items-center">
              <Logo />
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
