import React from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ size, url, cardTitle }) => {
  return (
    <div className="col" role="button" id="cardHover">
      <div className="card p-2" style={{ width: { size }, height: { size } }}>
        <Link href={`/${url}`}>
          <div>
            <Image src="/images/folder.png" width={size} height={size} />
            <div className="card-img-overlay">
              <h5 className="card-title text-dark">{cardTitle}</h5>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
