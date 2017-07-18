import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Search from '../../components/Search/search.jsx';
import actions from '../../actions';
import { connect, Store } from 'react-redux';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class Details extends React.Component {
  constructor(props) {
    console.log('props from Details! = ', props)
    super(props);
  }
  
  componentDidMount() {

  }

  render() {
    console.log('Details->this.props = ', this.props.venue);
    return (
      <div>
        <h1>BEER NAME: {this.props.venue.selectedVenue.breweries[0].name}</h1>
        BREWERY ICON: {this.props.venue.selectedVenue.breweries[0].images ? <img src={this.props.venue.selectedVenue.breweries[0].images.squareMedium} alt="boohoo" className="img-responsive" /> : null}
        <h3>ABV: {this.props.venue.selectedVenue.abv}</h3>
        <h3>BREWERY ID: {this.props.venue.selectedVenue.breweries[0].id}</h3>
        <h3>WEBSITE: {this.props.venue.selectedVenue.breweries[0].website}</h3>
        <p>{this.props.venue.selectedVenue.style.description}</p> 
      </div>
    );
  }
}
  

const stateToProps = (state) => {
  return {
    venue: state.venue
  }
}

const dispatchToProps = (dispatch) => {
  return {
    selectVenue: (venue) => {
      dispatch(actions.selectVenue(venue));
    }
  }
}

export default connect(stateToProps, dispatchToProps)(Details);