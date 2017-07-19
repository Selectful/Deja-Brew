import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
// import { Route } from 'react-router';
// import FlatButton from 'material-ui/FlatButton';
import actions from '../../actions';
import { connect } from 'react-redux';
import axios from 'axios';

import ThumbsUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbsDown from 'material-ui/svg-icons/action/thumb-down';
import Badge from 'material-ui/Badge';
import { blue500, red500, yellow500 } from 'material-ui/styles/colors';

import DialogMsg from '../Dialog/DialogMsg.jsx';

const styles = {
  card: {
    'paddingTop': 0
  }
};

class BeerListEntry extends React.Component {
  constructor(props) {
    super(props);
//    console.log('props from BeerListEntry' ,props)
    this.state = {
      //locationValue: ''
      beerLike: 0,
      beerDislike: 0,
      userOpinion: 0,
      open: false,
      msgTitle: 'Please sign in',
      msgBody: 'Users must be signed in to vote',
      userInfo: {}
    };
    this.selectVenue = this.selectVenue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.navigateToDetailsPage = this.navigateToDetailsPage.bind(this);
    this.handleUpClick=this.handleUpClick.bind(this);
    this.handleDownClick=this.handleDownClick.bind(this);
  }

  handleClick(e, data) {
    e.preventDefault();
    this.selectVenue();
    this.navigateToDetailsPage();
  }

  selectVenue() {
    this.props.selectVenue(this.props.beer.breweries[0]);
  }

  navigateToDetailsPage () {
    this.props.history.push('/details');
  }

  componentDidMount() {
    let info = JSON.parse(localStorage.getItem('userInfo'));
    this.setState({ userInfo: info });
    this.tallyLikes(info); 
  }

  tallyLikes(info) {
    let likeCount = 0;
    let dislikeCount = 0;
    let userId=info.id;
    let opinion = 0;
    console.log('*** beerId ***', this.props.beerId)
    console.log('*** userId ***', userId)
    axios.get('/beerRatings/' + this.props.beerId)
    .then((data) => {
      let numberOfEntries = data.data.length;
      for (let idx = 0; idx < numberOfEntries; idx ++) {
        data.data[idx].beerRating === 1 && likeCount++;
        data.data[idx].beerRating === -1 && dislikeCount++;
        if (data.data[idx].userId === userId) {
          console.log('userInfo id', data.data[idx].userId)
          opinion = data.data[idx].beerRating;
        }
      }
      this.setState({ beerLike: likeCount, beerDislike: dislikeCount, userOpinion: opinion })
    })
  }

  handleUpClick() {
    console.log('inside up click')
    let userId = this.state.userInfo.id;
    if (userId) {
      axios.put('/beerRatings/' + userId + '?beerId=' + this.props.beerId, { beerRating: 1 })
        .then(() => {
          this.tallyLikes(this.state.userInfo);
        })
    } else {
      console.log('dialog box here to ask user to sign in')
    }
  }

  handleDownClick() {
    console.log('inside down click')
    let userId = this.state.userInfo.id;
    if (userId) {
      axios.put('/beerRatings/' + userId + '?beerId=' + this.props.beerId, { beerRating: -1 })
        .then(() => {
          this.tallyLikes(this.state.userInfo);
        })
    } else {
      console.log('dialog box here to ask user to sign in')
    }
  }

  render() {
    console.log('states', this.state.beerLike, this.state.beerDislike, this.state.userOpinion );

    return (
      <Card>
        <CardHeader
          onClick={() => { this.handleClick(event, this) }}
          title={this.props.beer.breweries[0].name}
          subtitle={this.props.beer.name}
          showExpandableButton={true}
          avatar={this.props.beer.breweries[0].images ?
            this.props.beer.breweries[0].images.squareMedium
            : "../../images/No_picture_available.jpg"}
        />
        <CardText
          style={styles.card}
        >
          Website: <a href={this.props.beer.breweries[0].website} target="_blank">
            {this.props.beer.breweries[0].website}
          </a>
        </CardText>
        <CardText
          style={styles.card}
        >
          Phone: {!!this.props.beer.breweries[0].locations ?
            this.props.beer.breweries[0].locations[0].phone : 'No Phone Info'}
        </CardText>
        <CardText
          style={styles.card}
        >
          Located At: {!!this.props.beer.breweries[0].locations[0] ?
            this.props.beer.breweries[0].locations[0].streetAddress : ''}
          <br />
          {!!this.props.beer.breweries[0].locations[0] ?
            this.props.beer.breweries[0].locations[0].locality : ''}
          <br />
          {!!this.props.beer.breweries[0].locations[0] ?
            this.props.beer.breweries[0].locations[0].region : ''}
        </CardText>
        <CardText expandable={true}>
          {this.props.beer.breweries[0].description}
        </CardText>
        ({ this.state.beerLike }) ? (       
          <ThumbsUp onClick={() => { this.handleUpClick() }} color={ (this.state.userOpinion === 1) ? (blue500) : ('') } />
          <Badge badgeContent={ this.state.beerLike } />
        ) : ()
        ({ this.state.beerDisLike }) ? (
          <ThumbsDown onClick={() => { this.handleDownClick() }} color={ (this.state.userOpinion === -1) ? (red500) : ('')} /><Badge badgeContent={ this.state.beerDislike } />
        ) : ()

      </Card>
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

export default connect(stateToProps, dispatchToProps)(BeerListEntry);

