"use client";

export const NewDiv = (reservationSystem: any) => {
  return (
    <div className="bg-red-500 hidden w-1/4 mx-auto px-4 py-2 font-bold">
      <p>We're testing a flag in a component</p>
      {reservationSystem.reservationSystem && (
        <div>
          <p>Other Flag</p>
        </div>
      )}
    </div>
  );
};
