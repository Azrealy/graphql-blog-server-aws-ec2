import React from "react";

import Loading from "../Loading";

import './style.css';

const ButtonUnobtrusive = ({
    children,
    className,
    type = 'button',
    ...props
}) => (
    <button
    className={`${className} Button_unobtrusive`}
    type={type}
    {...props}
  >
    {children}
  </button>
);


const FetchMore = ({
    loading,
    hasNextPage,
    variables,
    updateQuery,
    fetchMore,
    children,
  }) => (
    <div className="FetchMore">
      {loading ? (
        <Loading />
      ) : (
        hasNextPage && (
          <ButtonUnobtrusive
            className="FetchMore-button"
            onClick={() => fetchMore({ variables, updateQuery })}
          >
            More {children}
          </ButtonUnobtrusive>
        )
      )}
    </div>
  );
  
  export default FetchMore;