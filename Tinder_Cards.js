import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import "./TinderCards.css";

function TinderCards() {
    const [maids, setMaids] = useState([
        {
            name: "Maria - 5⭐ Deep Cleaning",
            url: "https://i.imgur.com/4ZQZ9rj.jpg",
            bio: "Over 10 years of experience, specializes in deep cleans and organization.",
        },
        {
            name: "Lucy - Pet-Friendly",
            url: "https://i.imgur.com/GgR4Jzj.jpg",
            bio: "Loves pets! Great with fur cleanup and gentle with animals.",
        },
        {
            name: "Anita - Speed Cleaning Pro",
            url: "https://i.imgur.com/EGfI5sJ.jpg",
            bio: "Gets the job done fast without sacrificing quality.",
        },
    ]);

    const [lastSwipe, setLastSwipe] = useState("");

    const swiped = (direction, maidName) => {
        setLastSwipe(
            direction === "right"
                ? `✨ You matched with ${maidName.split(" -")[0]}!`
                : `⛔ You skipped ${maidName.split(" -")[0]}.`
        );
    };

    return (
        <div className="matchmaid">
            <h1 className="title">🧹 MatchMaid</h1>
            <p className="subtitle">Swipe right to request a maid. Left to skip.</p>
            <div className="tinderCards__cardContainer">
                {maids.map((maid) => (
                    <TinderCard
                        className="swipe"
                        key={maid.name}
                        preventSwipe={["up", "down"]}
                        onSwipe={(dir) => swiped(dir, maid.name)}
                    >
                        <div
                            style={{ backgroundImage: `url(${maid.url})` }}
                            className="card"
                        >
                            <div className="card__badge">⭐ Top Rated</div>
                            <div className="card__availability">✅ Available Now</div>
                            <div className="card__text">
                                 <h3>{maid.name}</h3>
                                 <p>{maid.bio}</p>
                            </div>

                            <div className="card__text">
                                <h3>{maid.name}</h3>
                                <p>{maid.bio}</p>
                            </div>
                        </div>
                    </TinderCard>
                ))}
            </div>
            {lastSwipe && <div className="swipe-feedback">{lastSwipe}</div>}
        </div>
    );
}

export default TinderCards;
