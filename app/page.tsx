import Image from "next/image";

export default function Home() {
  return (
    <div className="grid h-screen">
      <div className=" grid text-center justify-center items-center">
        <div className="space-y-8">
          <h1 className="text-3xl text-white font-bold font-audimat">
            Flag Creator Test
          </h1>
          <p className="text-4xl font-audimat ldgradient pb-8 w-3/4 mx-auto">
           When I create new flags in a PR, I feed them into the API and maybe it creates them? We'll see 
          </p>
        </div>
      </div>
    </div>
  );
}
