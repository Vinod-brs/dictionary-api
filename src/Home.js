import React, { useState } from "react";
import './App.css'
import { HttpGet } from "./core/store/httpHelper";
import ReactAudioPlayer from 'react-audio-player';


export const Home = () => {
  const [Load, setLoad] = useState(null);
  const [wordDetails, setWordDetails] = useState(null);
  const [noDefinitionFound, setNoDefinitionFound] = useState(null);
  const [wordAudio, setAudio] = useState(null);

  const getWordDetails = async(event) => {
    setWordDetails(null);
    setNoDefinitionFound(null);
    setLoad('s');
    event.preventDefault();
    try {
      if(event.target.search.value) {
        setNoDefinitionFound(null);
        let wordData = await HttpGet(event.target.search.value);
        setWordDetails(wordData[0]);
        let audioSrc = wordData[0].phonetics?.filter((e) => e?.audio !== '')[0]?.audio || null;
        setAudio(audioSrc);
      }
    } catch (err) {
      setWordDetails(null);
      setAudio(null);
      setNoDefinitionFound(err?.response?.data?.title);
    }
    setLoad(null);
  }

  return (
    <>
     
      <div className="row m-0 justify-content-lg-center">
        <div className="col col-4 mt-4">
          <div className="input-group mb-3">
            <form onSubmit={getWordDetails}>
              <input name='search' type="search" className="form-control " placeholder="Search for a word here..." aria-label="Search for a word..." aria-describedby="img-search" autoFocus autoComplete="false" />
            </form>
          </div>
        </div>
      </div>
      <div className="row m-0 justify-content-lg-center">
        <div className="col col-6 mt-4 text-center">
          {
            Load && <div className="spinner-border text-info  p-4" role="status"></div> 
          }
          {wordDetails &&
            <>
              <h1 className='f-bold'>{wordDetails?.word}</h1>
              {wordAudio &&
                <ReactAudioPlayer
                  controls
                  controlsList={"nodownload"}
                  src={wordAudio}
                />
              }
              <h3>{wordDetails?.phonetic}</h3>
              {wordDetails?.meanings?.map((e,i) => {
                return (
                  <React.Fragment key={i}>
                    <h3>{e.partOfSpeech}</h3>
                    <h5>{e.definitions[0]?.definition}</h5>
                    <h5>{e.definitions[0]?.example}</h5>
                  </React.Fragment>
                )
              })}
            </>
          }
          {noDefinitionFound && <h2 className='text-danger'>{noDefinitionFound}</h2>}
        </div>
      </div>
    </>
  )
}