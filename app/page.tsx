"use client";
import { NewDiv } from "@/components/newdiv";
import { useFlags } from "launchdarkly-react-client-sdk";
import Image from "next/image";
import { useState } from "react";
import { infinity } from "ldrs";
import { CreateFlagInProject } from "@/utils/flagsAPI";

export default function Home() {
  infinity.register();
  const [gitUrl, setGitURL] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [yolocreate, setYoloCreate] = useState(false);
  const [flags, setFlags] = useState();

  async function submitFlags(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({ gitUrl, project, yolocreate }),
    });

    const data = await response.json();

    setFlags(data.flagData.items);

    console.log(flags);
    setLoading(false);

    return response;
  }

  async function createFlag(
    name: string,
    key: string,
    description: string,
    kind: string
  ) {
    const response = await CreateFlagInProject(
      project,
      kind,
      name,
      key,
      description
    );
    // create a flag in a launchdarkly project using the api
    const data = await response;
    console.log(data);
    return data;
  }

  const { newLoginSystem, bannerMessage, reservationSystem } = useFlags();
  return (
    <div className="grid h-screen">
      <div className="text-center mt-20">
        <div className="space-y-4">
        
          <h1 className="text-8xl text-white font-bold  font-audimat">
            The Creator
          </h1>
          <p className="text-2xl font-audimat ldgradient pb-4 w-1/2 mx-auto">
            When I create a PR - im using OpenAI GPT-4o to analyze the PR, and
            identify feature flag additions.
          </p>
        </div>

        <div className="mt-10">
          <form onSubmit={submitFlags}>
            <div className="flex flex-col w-1/3 mx-auto">
              <p className="text-2xl">GitHub PR URL</p>
              <input
                className="bg-transparent outline-none border-b-2 border-blue-500 pb-2 mb-4"
                type="text"
                value={gitUrl}
                onChange={(e) => setGitURL(e.target.value)}
              />
              <p className="text-2xl">Destination Project</p>
              <input
                className="bg-transparent outline-none border-b-2 border-blue-500 pb-2 mb-4"
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
              <p className="text-2xl">Yolo Create</p>
              <input
                className="bg-transparent outline-none border-b-2 border-blue-500 mb-4 mt-2"
                type="checkbox"
                onChange={(e) => setYoloCreate(e.target.checked)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 items-center font-bold mt-3"
            >
              {loading ? (
                <l-infinity
                  size="45"
                  stroke="4"
                  stroke-length="0.15"
                  bg-opacity="0.1"
                  speed="1.3"
                  color="white"
                />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
        <div className="mx-32 my-10 grid justify-center">
          {flags &&(
        <p className="text-4xl font-audimat ldgradient pb-4 ">Flags Detected in this PR:</p>
      )}
          <div className="flex flex-row gap-4 text-center">
            
            {flags?.map((flag: any, index: any) => (
              <div
                key={index}
                className="border-2 border-white/30 rounded-lg px-4 py-2 text-left space-y-2 w-[400px] h-[300px] relative"
              >
                <p>
                  <span className="font-bold">Flag Name:</span> {flag.flagName}
                </p>
                <p>
                  <span className="font-bold">Key:</span> {flag.flagKey}
                </p>
                <p>
                  <span className="font-bold">Type:</span> {flag.type}
                </p>
                <p>
                  <span className="font-bold">Description:</span>{" "}
                  {flag.description}
                </p>
                <p>
                  <span className="font-bold">Flag Location (file):</span>{" "}
                  {flag.file}
                </p>
                <button
                  className="absolute px-4 py-2 bg-blue-500 bottom-5"
                  onClick={() =>
                    createFlag(
                      flag.flagName,
                      flag.flagKey,
                      flag.description,
                      flag.type
                    )
                  }
                >
                  Create Flag
                </button>
              </div>
            ))}
          </div>
        </div>
        {newLoginSystem && (
          <div>
            <p>Bool Test</p>
          </div>
        )}
        <div className="border-2 border-white/20 w-1/4 p-4 mx-auto my-10">
          <p>The test string flag is: {bannerMessage}</p>
        </div>
        <NewDiv reservationSystem={reservationSystem} />
      </div>
    </div>
  );
}
