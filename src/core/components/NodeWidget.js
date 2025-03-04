import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import Modal from 'react-modal';

import NodeWidgetModal from './modals/NodeWidgetModal';
import NodeInspectorLink from './NodeInspectorLink'
import modalStyle from '../../core/utils/modalStyle'
import store from '../store/main'

/**
 * Using a observer on this component will break things... :/
 * Instead put store dependent functionality in child components
 */

export default class NodeWidget extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

	render() {
		return (
            <div className={"flex font-mono text-xxs text-gray-200"} onDoubleClick={this.open.bind(this)}>
                <div className="flex-grow-0 max-w-md">
                    {this.renderHeading()}
                    {this.renderInPorts()}                  
                    {this.renderOutPorts()}
                    <div className="w-32">{/* Enforce min width with this div*/}</div>
                </div>

                {this.renderModal()}
            </div>
		);
    }

    renderHeading() {
        return (
            <div
                className={"flex justify-between items-center pr-2 py-1 border border-gray-900 font-bold rounded-lg bg-gray-700 "
                    + (this.props.node.isSelected() ? 'bg-malibu-900' : '')}
            >
                <span className="mx-4">{this.props.node.getDisplayName()}</span>
                <i className="fas fa-cog"></i>
            </div>            
        )
    }
    
    renderInPorts() {
        return Object.values(this.props.node.getInPorts()).map((port) => {
            return (
                <div className="flex w-full" key={port.options.name}>
                    <PortWidget className="-mr-1 z-10 flex items-center text-lg justify-center fill-current text-malibu-700 hover:text-malibu-500" engine={this.props.engine} port={port}>
						<svg width="12px" height="12px" fill="" className="m-auto">
							<polygon points="0,0 12,6 0,12"/>
						</svg>						
					</PortWidget>
                    <div className="flex w-full items-center text-gray-200 py-1 border border-gray-900 rounded-lg bg-gray-500">
                        <div className="flex items-center justify-between w-full">
                            <span className="flex px-4 flex-1">{port.options.label}</span>
                            <NodeInspectorLink store={store} nodeId={this.props.node.options.id} />
                        </div>
                    </div>
                    <div className="ml-2">{/* Counterweight */}</div>
                </div>                
            )
        })
    }

    renderInspectIcon() {
        return this.props.node.isInspectable() && 
            (<div onClick={(e) => { this.props.store.goToInspector(this.props.node.options.id) }}>
                <i className='mr-2 text-malibu-600 fas fa-search hover:cursor'></i>
            </div>)
    }

    renderOutPorts() {
        return Object.values(this.props.node.getOutPorts()).map((port) => {
            return (
                <div className="flex w-full" key={port.options.name}>
                    <div className="mr-2">{/* Counterweight */}</div>
                    <div className="flex w-full items-center text-gray-200 py-1 border border-gray-900 rounded-lg bg-gray-500">
                        <div className="flex items-center justify-between w-full">
                            <span className="flex px-4 flex-1">{port.options.label}</span>
                        </div>
                    </div>
                    <PortWidget className="-ml-1 z-10 flex items-center text-lg justify-center fill-current text-malibu-700 hover:text-malibu-500" engine={this.props.engine} port={port}>
						<svg width="12px" height="12px" fill="" className="m-auto">
							<polygon points="0,0 12,6 0,12"/>
						</svg>
					</PortWidget>
                </div>                
            )
        })
    }    

    renderModal() {
        return (
            <Modal
                isOpen={this.state.isOpen}
                onRequestClose={this.closeModal.bind(this)}
                style={modalStyle}
            >
                    <NodeWidgetModal
						store={store}
                        node={this.props.node} 
                        closeModal={this.closeModal.bind(this)}
                    />
            </Modal>
        );
    }    

    open() {
		this.props.store.diagram.engine.model.setLocked(true)

        this.setState({
            isOpen: true
        });
    }

    closeModal() {
		this.props.store.diagram.engine.model.setLocked(false)

        this.setState({
            isOpen: false
        });
    }    
}

