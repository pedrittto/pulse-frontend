import React from "react";
import NewsCard from "./NewsCard";
import { Article } from "../lib/articleTypes";

interface NewsCardListProps {
  cards: Article[];
}

const NewsCardList: React.FC<NewsCardListProps> = ({ cards }) => {
  if (!cards || !Array.isArray(cards)) {
    return <p className="text-gray-600 text-center py-8">No articles available</p>;
  }

  if (cards.length === 0) {
    return <p className="text-gray-600 text-center py-8">No articles available</p>;
  }

  return (
    <div className="mt-4 px-3 space-y-4 max-w-2xl mx-auto">
      {cards.map((card) => (
        <NewsCard key={card.id} article={card} />
      ))}
    </div>
  );
};

export default NewsCardList;
