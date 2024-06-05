"use client";

export const NewDiv = (otherFlag: any) => {
  return (
    <div className="bg-red-500">
      <p>Test</p>
      {otherFlag.otherFlag && (
        <div>
          <p>Other Flag</p>
        </div>
      )}
    </div>
  );
};
