import React, {Component, PropTypes} from "react";
import Tab from 'react-toolbox/lib/tabs/Tab';
import Tabs from 'react-toolbox/lib/tabs/Tabs';
import {browserHistory} from 'react-router';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as navActionsCreators from "../../actions/navActions";

export class Header extends Component {
  constructor() {
    super();

    this.state = {
      index: 0,
      list: [
        {label: 'Quiz', href: '/'},
        {label: 'Leaderboard', href: '/leaderboard'},
        {label: 'About', href: '/about'},
        {label: 'Login', href: '/login'},
        {label: 'Register', href: '/register'},
      ]
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentWillMount() {
    this.state.list.map((element, index) => {
      if (element.href === location.pathname) {
        return this.props.navActions.setNavActive(Object.assign({}, this.state, {index}));
      }

      return false;
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: nextProps.nav.index
    });
  }

  handleTabChange = (index) => {
    this.setState({
      index
    });

    this.props.navActions.setNavActive(Object.assign({}, this.state, {index}));

    if (this.state.list[index]) {
      return browserHistory.push(this.state.list[index].href);
    }

    browserHistory.push(this.state.list[0].href);
  };

  render() {

    return (
      <div className="row">
        <div className="column small-12">
          <h2>React Quiz example:</h2>
          <br/>

          <Tabs index={this.state.index} onChange={this.handleTabChange} fixed>
            {this.state.list.map((item, index) => {
              return <Tab key={index} label={item.label} />
            })}
          </Tabs>
        </div>
      </div>
    )
  }
}


Header.propTypes = {
  nav: PropTypes.object.isRequired,
};

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    nav: state.nav,
  }
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(navActionsCreators, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
