import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb.js';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header.js';

export default () => {
  
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  
  useEffect(()=>{
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=>i.slug==='originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }      
    }
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },[]);

  return (
    <div className="page">
      
      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      } 

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />                      
        ))}
      </section>

      <footer>

        Desenvolvido por <a href="https://www.afonsodev.com">Afonso.Dev</a><br/>
        Professor: <a href="https://www.youtube.com/watch?v=tBweoUiMsDg">Bonieky Lacerda</a><br/>
        Direitos de imagem à <a href="https://www.netflix.com.br">Netflix</a><br/>
      </footer>

      {movieList.length <= 3 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando"/>
        </div>
      }
    </div>
  )
}