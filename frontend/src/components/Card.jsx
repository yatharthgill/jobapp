import React from "react";
import styled from "styled-components";

const Card = ({ id, source, url, title, company, location, salary, published}) => {
  return (
    <StyledWrapper>
      <div className="card">
        <span
          className={`card-badge ${
            source === "linkedin" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {" "}
          {source.charAt(0).toUpperCase() + source.slice(1).toLowerCase()}
        </span>
        <div className="card-details">
          <p className="text-title">{title}</p>
          <p className="text-body">
           Company:- {company}
          </p>
          {salary && <p className="text-body">Salary: {salary}</p>}
          <p className="text-location">
            <span className="location-icon">Location📍:-</span>
            {location}
          </p>
          {published && <p className="text-date text-green-600 text-bold">
            Published: {new Date(published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>}
        </div>
        <button className="card-button">
          <a href={url} target="_blank">Apply Now</a>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 190px;
    height: auto;
    border-radius: 20px;
    background: #f5f5f5;
    position: relative;
    padding: 1.8rem;
    border: 2px solid #c3c6ce;
    transition: 0.5s ease-out;
    overflow: visible;
  }

  .card-badge {
    display: inline-block;
    color: #fff;
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 1rem;
    align-self: flex-start;
  }

  .card-details {
    color: black;
    height: 100%;
    gap: 0.5em;
    display: grid;
    place-content: center;
  }

  .text-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #003366;
  }

  .text-body {
    font-size: 0.9rem;
    color: #555;
  }
  
  .text-date{
      font-size: 0.85rem;
}

  .text-location {
    font-size: 0.85rem;
    color: #008bf8;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: 500;
  }

  .location-icon {
    font-size: 0.9rem;
  }

  .card-button {
    transform: translate(-50%, 125%);
    width: 60%;
    border-radius: 1rem;
    border: none;
    background-color: #008bf8;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    position: absolute;
    left: 50%;
    bottom: 0;
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .card:hover {
    border-color: #008bf8;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }

  .card:hover .card-button {
    transform: translate(-50%, 50%);
    opacity: 1;
  }
`;

export default Card;
