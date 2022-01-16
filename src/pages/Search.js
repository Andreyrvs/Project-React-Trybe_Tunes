import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { getUser } from '../services/userAPI';
import './css/search.css';
import searchAlbumsAPI from '../services/searchAlbumsAPI';

const NAME_LENGTH = 2;

class Search extends Component {
  constructor() {
    super();
    this.receiveAPI = this.receiveAPI.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.buttonDisable = this.buttonDisable.bind(this);
    this.callAPI = this.callAPI.bind(this);
    this.renderAlbums = this.renderAlbums.bind(this);
    this.state = {
      userName: '',
      isLoading: false,
      searchLoading: false,
      isBtnDisable: true,
      searchArtist: [],
      inputValue: '',
      artistResult: '',
    };
  }

  componentDidMount() {
    this.receiveAPI();
  }

  handleChange({ target }) {
    const { name, value, type, checked } = target;
    this.setState({
      [name]: type === 'checkbox' ? checked : value,
    }, () => this.buttonDisable());
  }

  async receiveAPI() {
    this.setState({
      isLoading: true,
    });
    const resolve = await getUser();
    this.setState({
      userName: resolve.name,
      isLoading: false,
    });
  }

  buttonDisable() {
    const { inputValue } = this.state;
    const validateInput = inputValue.length < NAME_LENGTH;

    this.setState({
      isBtnDisable: validateInput,
    });
  }

  async callAPI(event) {
    event.preventDefault(event);
    this.setState({
      searchLoading: true,
      inputValue: '',
      isBtnDisable: true,
    });
    const { inputValue } = this.state;
    const resolve = await searchAlbumsAPI(inputValue);
    this.setState({
      searchLoading: false,
      artistResult: inputValue,
      searchArtist: resolve,
    });

    console.log(resolve);
  }

  renderAlbums() {
    const { artistResult, searchArtist } = this.state;
    return (
      <div className="render-albums">
        {/* { (searchArtist !== inputValue) ? <p>Nenhum álbum foi encontrado</p> : ( */}
        <section>
          <h1>
            {`Resultado de álbuns de: ${artistResult}`}
          </h1>
        </section>
        <section className="card-album-container">
          {searchArtist.map((artist) => (
            <section key={ artist.collectionId } className="card-album">
              <img
                className="album-image"
                src={ artist.artworkUrl100 }
                alt={ artist.artistName }
              />
              <span>
                {artist.collectionName}
              </span>
              <span>
                {artist.artistName}
              </span>
            </section>))}
        </section>
        {/* )} */}
      </div>
    );
  }

  renderForm() {
    const { inputValue, isBtnDisable } = this.state;
    return (
      <form onSubmit={ (event) => this.callAPI(event) }>
        <Input
          datatest="search-artist-input"
          onInputChange={ this.handleChange }
          elementId="input-search-artist"
          name="inputValue"
          type="text"
          value={ inputValue }
          placeHolder="Nome do Artista"
        />
        <Button
          datatest="search-artist-button"
          text="Pesquisar"
          type="submit"
          name="isBtnDisable"
          elementId="button-search-artist"
          value={ isBtnDisable }
          handleChange={ this.renderAlbums }
        />
      </form>
    );
  }

  render() {
    const { isLoading, userName, searchLoading } = this.state;
    return (
      <div data-testid="page-search" className="search-page">
        {isLoading ? <Loading /> : (
          <>
            <Header userName={ userName } />
            {searchLoading ? <Loading /> : (
              <section className="search-container">
                <div className="form-album-container">
                  {this.renderForm()}
                </div>
                {this.renderAlbums()}
              </section>
            )}
          </>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  searchArtist: PropTypes.string,
}.isRequire;

export default Search;
