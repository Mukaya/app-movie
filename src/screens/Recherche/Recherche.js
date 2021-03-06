import React, {useState, useEffect, Fragment} from 'react'
import Spinner from '../../components/Spinner';
import { ContainerCard } from '../AllFilms/style';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useSelector } from 'react-redux';
import {APIKey} from '../../APIKey';
import Pagination from '../../components/Pagination';
import ModalDetail from '../../components/ModalDetail';

const Recherche = () => {
    let {dataSearch} = useSelector((state)=>{
        return state.dataFilms;
    });
    const [dataFilms, setDataFilms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filmsByPage] = useState(8);

    const [MonFilm, setMonFilm] = useState('');
    const [showM, setShowM] = useState(false);
    const handleClose = () => {
      setShowM(false);
    }


    const getAllFilms = async () =>{
        await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=${dataSearch}`)
        .then(res => {
            setDataFilms(res.data.results);
        })
        .catch(err => {
            console.error(err); 
        })
   }
    useEffect(()=>{
        getAllFilms();
    },[dataSearch]);

    const indexOfLastFilm = currentPage * filmsByPage;
    const indexOfFistFilm = indexOfLastFilm - filmsByPage;
    const currentFilm = dataFilms.slice(indexOfFistFilm, indexOfLastFilm); 

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <ContainerCard>
            <div className="ligne">
           {
              currentFilm.length ? currentFilm.map(film=>{
                   return(
                       <Fragment>
                        <div className="card">
                            <img style={{width:'100%', height:'100%', cursor:'pointer'}} 
                            src={`${film.poster_path ? `https://image.tmdb.org/t/p/w500/${film.poster_path}`:null}`} 
                            alt=""
                            onClick={()=>{
                                setMonFilm(film.id);
                                setShowM(true);
                            }}
                            />
                        </div>
                       </Fragment>
                   );
               })
               : <Spinner/>
           }
            </div>
            <ModalDetail handleShow={showM} handleClose={handleClose} id={MonFilm}/>
            <div style={{margin:'20px auto', width:'50px'}}>
                <Pagination filmsByPage={filmsByPage} totalFilm={dataFilms.length} paginate={paginate} currentPage={currentPage}/>
            </div>
        </ContainerCard>
    )
}

export default Recherche
