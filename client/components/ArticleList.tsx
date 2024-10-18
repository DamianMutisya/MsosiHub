import React from 'react'

interface Article {
  title: string;
  url: string;
  source: string;
}

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Related Recipe Articles:</h3>
      <ul className="list-disc pl-5">
        {articles.map((article, index) => (
          <li key={index} className="mt-2">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </a>
            <span className="text-sm text-gray-500 ml-2">- {article.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

