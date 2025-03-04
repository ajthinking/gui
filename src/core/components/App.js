import React from 'react';
import Header from './Header';
import Toolbar from './Toolbar';
import pages from './pages/factory'
import { observer } from "mobx-react"
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EngineFactory from '../../core/EngineFactory'
import store from "../store/main"
import Cookie from '../utils/Cookie';
import * as demos from '../../server/demos.ts'

export default observer(class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            booted: false
        }
    }

    render() {
        return (
            <div >
                <Header />
                <Toolbar store={store} />
                {this.state.booted && this.renderActivePage()}
                <ToastContainer style={{paddingTop: '0px'}} />
            </div>
        );
    }

    renderActivePage()
    {
        let Page =  pages(this.props.store.metadata.page)
        return (<Page store={store} />)
    }
    
    componentDidMount() {
        this.boot()
        this.registerKeybindings()
        //this.registerExitConfirmation()
    }

    boot() {
        this.props.store.metadata.client.boot({
            story: window.location.href.split("/datastory").pop().replace('/', '')
        }).then((response) => {
            this.props.store.setEngine(
                EngineFactory.loadOrCreate(
                    response.data.serializedModel ?? null
                )
            )

			this.bootDemos()

            this.props.store.setAvailableNodes(
                response.data.availableNodes
            );

            this.props.store.setStories(
                Cookie.keys()
            );


            this.setState({
                booted: true
            })
        })
        .catch(error => {
            console.error('Boot error', error)
            this.showBootFailureToast()
        });
    }

	bootDemos() {
		for(const name of Object.keys(demos)) {
			this.props.store.metadata.client.save(name, demos[name])
		}
		// this.props.store.metadata.client.save('With parameters', demos.WithParameters)
		// this.props.store.metadata.client.save('Working with json', demos.WorkingWithJSON)
		// this.props.store.metadata.client.save('Scraping a map service', demos.ScrapingAMapService)
		// this.props.store.metadata.client.save('Cleanup old github repos', demos.CleanupOldGithubRepos)
	}

    registerKeybindings() {
        Mousetrap.bind(
            'shift+d',
            (e) => {
                this.props.store.setPage('Workbench')
            }
        );

        Mousetrap.bind(
            'shift+t',
            (e) => {
                this.props.store.setPage('Inspector')
            }
        ); 

        Mousetrap.bind(
            'shift+l',
            (e) => {
                this.props.store.setPage('Log   ')
            }
        );         
    }
    
    registerExitConfirmation() {
        window.onbeforeunload = function(e) {
            return "Do you want to exit this page?";
        };        
    }

    showBootFailureToast()
    {
        toast.info(' Could not Boot! Check console.', {
            position: "bottom-right",
            transition: Slide,
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
})