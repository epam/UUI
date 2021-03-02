import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { Slider } from '../../components/inputs/Slider/Slider';
import * as css from './ResizableContext.scss';

export class ResizableContext extends React.Component<DemoComponentProps, any> {

    constructor(props: DemoComponentProps) {
        super(props);
        this.state = {
            widthPercent: 100,
        };
    }

    public static displayName = "Resizable";
    render() {
        const { DemoComponent, props } = this.props;

        return (
            <div className={ css.panel }>
                <div className={ css.slider }>
                    <Slider  value={ this.state.widthPercent } onValueChange={ this.resizeHandler } min={ 0 } max={ 100 } step={ 1 } />
                </div>
                <div style={ {width: `${this.state.widthPercent}%`} }>
                    <DemoComponent { ...props } />
                </div>
            </div>
        );
    }

    private resizeHandler = (value: number) => {
        this.setState({
            ...this.state,
            widthPercent: value,
        });
    }
}