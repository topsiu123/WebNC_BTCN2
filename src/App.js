import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";
import React from 'react'

const UnsplashImage = ({ url, key }) => (
  <div key={key} >
    <img className="image-gallery-item" src={url} />
  </div>
);

const SearchBar = ({value, handleInput, handleSearchClick}) => (
  <nav className="navbar fs-2" style={{backgroundColor: "lightblue"}}>
    <div className="container-fluid justify-content-center">
      <a className="navbar-brand">Nguyễn Đăng Khoa - 20120509</a>
      <div className="d-flex input-group-sm" role="search">
        <input value={value} className="form-control me-2" type="search"
        placeholder="Search" aria-label="Search"
        onChange={(e) => handleInput(e.target.value)}></input>
        <button className="btn btn-outline-success" onClick={(e) => handleSearchClick()}>Search</button>
      </div>
    </div>
  </nav>
);

function SearchNotification({searchTerm}) {
  if (searchTerm === "")
  {
    return (
    <div className="fs-4 badge bg-primary text-wrap d-flex justify-content-center m-1">
      You can search something!
    </div>
  )}
  else
  {
    return (
    <div className="fs-2 badge bg-primary text-wrap d-flex justify-content-center m-1">
      Search result for: {searchTerm}
    </div>
  )}
};

export default function Collage() {

  const [images, setImages] = useState([]);
  const [loaded, setIsLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(1);

  function fetchImages(){
    setSearchPage(searchPage + 1);
    const apiRoot = "https://api.unsplash.com";
    const accessKey = "FTR-aoHKUUu5JLl11tkZ87uY-fiJXqCBvUtnjPZSTQ8";
    if (searchTerm === "")
    {
      axios
      .get(`${apiRoot}/photos/random?client_id=${accessKey}&count=10`)
      .then (res => {
        setImages([...images, ...res.data]);
        setIsLoaded(true);
      });
    }
    else
    {
      axios
      .get(`${apiRoot}/search/photos?query=${searchTerm}&client_id=${accessKey}&page=${searchPage}`)
      .then (res => {
        setImages([...images, ...res.data.results]);
        setIsLoaded(true);
      });
    }
  };

  function handleInput(input) {
    setSearchInput(input)
  }

  function handleSearchClick() {
    setImages([]);
    setSearchPage(1);
    setSearchInput("");
    setSearchTerm(searchInput)
  }

  useEffect(() => {
    fetchImages();
  }, [searchTerm]);

  return (
    <div>
      <SearchBar value={searchInput} handleInput={handleInput} handleSearchClick={handleSearchClick}></SearchBar>
      <SearchNotification searchTerm={searchTerm}></SearchNotification>
      <InfiniteScroll
        dataLength={images}
        next={() => fetchImages()}
        hasMore={true}
        loader={<img
          src="https://media.tenor.com/28DFFVtvNqYAAAAC/loading.gif"
          alt="loading"/>}>
            <div className="image-gallery">
              {loaded ?
                images.map((image, index) => (
                    <UnsplashImage url={image.urls.regular} key={image.urls.id} />
                )): ""}
            </div>
      </InfiniteScroll>
    </div>
  );
};