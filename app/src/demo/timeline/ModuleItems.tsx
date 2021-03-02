import { TimelineTransform } from '@epam/uui-timeline/TimelineTransform';
import { BaseTimelineCanvasComponent, BaseTimelineCanvasComponentProps } from '@epam/uui-timeline/BaseTimelineCanvasComponent';
import * as React from 'react';
import * as styles from './ModuleItems.scss';

export interface Item {
    id: number;
    from: Date;
    to: Date;
    y: number;
    name: string;
    color: string;
}

export interface ModuleItemsProps extends BaseTimelineCanvasComponentProps {
    items: Item[];
}

export class ModuleItems extends React.Component<ModuleItemsProps, {}> {

    componentDidMount() {
        this.props.timelineController.subscribe(this.handleForceUpdate);
        // this.handleForceUpdate(this.props.timelineController.getTransform());
    }

    handleForceUpdate = () => {
        this.forceUpdate();
    }

    renderDivs(items: Item[]) {
        let t = this.props.timelineController.getTransform();

        return items.map(i => {
          let transformedItem = t.transformSegment(i.from, i.to);
          let left = transformedItem.leftTrimmed;
          let right = transformedItem.rightTrimmed;
          let width = right - left;

        //let transform = `translate3d(${left}px, 0, 0)`;
          let transform = `translateX(${left}px)`;

          return (
            width > 0 &&
            <div
                key={i.id} className={styles.moduleItem}
                style={{ transform, width }}
            >
                {i.name}
            </div>
            );
        });
      }

    render() {
        return (
            <div className={styles.moduleItems} >
                {this.renderDivs(this.props.items)}
            </div>
        )
    }
}