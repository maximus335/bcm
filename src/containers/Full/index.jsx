import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Breadcrumb from 'components/Breadcrumb';
import Footer from 'components/Footer';
import Dashboard from 'components/Dashboard';
/*
import Aside from 'components/Aside';
import Dashboard from 'views/Dashboard';
import Charts from 'views/Charts';
import Widgets from 'views/Widgets';
import Buttons from 'views/Components/Buttons';
import Cards from 'views/Components/Cards';
import Forms from 'views/Components/Forms';
import Modals from 'views/Components/Modals';
import SocialButtons from 'views/Components/SocialButtons';
import Switches from 'views/Components/Switches';
import Tables from 'views/Components/Tables';
import Tabs from 'views/Components/Tabs';
import FontAwesome from 'views/Icons/FontAwesome';
import SimpleLineIcons from 'views/Icons/SimpleLineIcons';
*/

import Settings from 'views/settings';
import UsersList from 'views/users/UsersList';
import UserCreation from 'views/users/UserCreation';
import TradeCreationPage from 'views/trades/TradeCreationPage';

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              { this.props.role === 'administrator' ? (
                <Switch>
                  <Route path="/users/all" name="UsersList" component={UsersList} />
                  <Route path="/users/create" name="NewUser" component={UserCreation} />
                  <Redirect from="*" to="/users/all" />
                </Switch>
              ) : (
                <Switch>
                  <Route exact path="/dashboard" name="Dashboard" component={Dashboard} />
                  <Route path="/trades/create" name="TradeCreationPage" component={TradeCreationPage} />
                  { /*
                  <Route path="/trades/all" name="TradesControl" component={TradesControl} />
                  <Route path="/trades/create" name="TradeCreation" component={TradeCreation} />
                  */ }
                  <Route path="/settings" name="Settings" component={Settings} />
                  <Redirect from="*" to="/dashboard" />
                </Switch>
              )}
              { /*
              <Route path="/dashboard" name="Dashboard" component={Dashboard} />
              <Route path="/components/buttons" name="Buttons" component={Buttons} />
              <Route path="/components/cards" name="Cards" component={Cards} />
              <Route path="/components/forms" name="Forms" component={Forms} />
              <Route path="/components/modals" name="Modals" component={Modals} />
              <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons} />
              <Route path="/components/switches" name="Swithces" component={Switches} />
              <Route path="/components/tables" name="Tables" component={Tables} />
              <Route path="/components/tabs" name="Tabs" component={Tabs} />
              <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome} />
              <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons} />
              <Route path="/widgets" name="Widgets" component={Widgets} />
              <Route path="/charts" name="Charts" component={Charts} />
              */ }
            </Container>
          </main>
          { /* <Aside /> */ }
        </div>
        <Footer />
      </div>
    );
  }
}

Full.defaultProps = { role: null };

Full.propTypes = { role: PropTypes.string };

const mapStateToProps = ({ user: { role } }) => ({ role });

export default connect(mapStateToProps)(Full);
