import { CanvasProps } from '@epam/uui-timeline';
import * as React from 'react';
import styles from './ModuleItems.module.scss';

export interface Item {
    id: number;
    from: Date;
    to: Date;
    y: number;
    name: string;
    color: string;
}

export interface ModuleItemsProps extends CanvasProps {
    items: Item[];
}

export class ModuleItems extends React.Component<ModuleItemsProps> {
    componentDidMount() {
        this.props.timelineController.subscribe(this.handleForceUpdate);
        // this.handleForceUpdate(this.props.timelineController.getTransform());
    }

    handleForceUpdate = () => {
        this.forceUpdate();
    };

    renderDivs(items: Item[]) {
        const t = this.props.timelineController.getTransform();

        return items.map((i) => {
            const transformedItem = t.transformSegment(i.from, i.to);
            const left = transformedItem.leftTrimmed;
            const right = transformedItem.rightTrimmed;
            const width = right - left;

            // let transform = `translate3d(${left}px, 0, 0)`;
            const transform = `translateX(${left}px)`;

            return (
                width > 0 && (
                    <div key={ i.id } className={ styles.moduleItem } style={ { transform, width } }>
                        {i.name}
                    </div>
                )
            );
        });
    }

    render() {
        return <div className={ styles.moduleItems }>{this.renderDivs(this.props.items)}</div>;
    }
}
