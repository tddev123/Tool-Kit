"use client";
import React from "react";
import Image from "next/image";

const BasicImage = () => {
  return (
    <div className="">
      <Image src="/Pictures/tiger.jpg" alt="Example Image" width={200} height={200} />
    </div>
  );
};

export default BasicImage;
