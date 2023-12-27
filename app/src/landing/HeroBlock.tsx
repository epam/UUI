import * as React from 'react';
import Measure from 'react-measure';
import { cx } from '@epam/uui-core';
import { FlexRow, Text } from '@epam/uui';
import css from './HeroBlock.module.scss';

export interface HeroBlockProps {}

export interface HeroBlockState {
    showAnimation: boolean;
}

export class HeroBlock extends React.Component<HeroBlockProps, HeroBlockState> {
    constructor(props: HeroBlockProps) {
        super(props);
        this.state = {
            showAnimation: false,
        };
    }

    toggleAnimation = (timeout: number) => {
        setTimeout(
            () =>
                this.setState((state) => ({
                    showAnimation: !state.showAnimation,
                })),
            timeout,
        );
    };

    renderStaticImage = () => {
        return <img alt="Demo site showcasing the capabilities of UUI" src="/static/images/hero_image.png" width="100%" />;
    };

    renderAnimatedImage = () => {
        return (
            <>
                <div style={ { width: '100%' } }>
                    <img alt="Demo site showcasing the capabilities of UUI" src="/static/images/Background.png" width="100%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.search } alt="Demo site showcasing the capabilities of UUI" src="/static/images/120_192.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_1 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/120_390.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_2 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/426_444.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_3 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/732_444.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_4 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/1038_444.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_5 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/426_744.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_6 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/732_744.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_7 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/1038_744.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_8 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/426_1044.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_9 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/732_1044.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_10 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/1038_1044.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_11 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/426_1344.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_12 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/732_1344.png" width="20%" />
                </div>
                <div style={ { width: '100%' } }>
                    <img className={ css.layer_13 } alt="Demo site showcasing the capabilities of UUI" src="/static/images/1038_1344.png" width="20%" />
                </div>
            </>
        );
    };

    componentDidMount() {
        this.toggleAnimation(1000);
        this.toggleAnimation(3000);
    }

    render() {
        return (
            <Measure bounds>
                {({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any; contentRect: any }) => {
                    const containerWidth = window ? window.innerWidth : contentRect.bounds.width;

                    return (
                        <div className={ css.layout } ref={ measureRef }>
                            <img alt="tree" src="/static/christmas/tree.svg" className={ css.christmasTree } />
                            <img alt="car" src="/static/christmas/car.svg" className={ css.christmasCar } />
                            <FlexRow cx={ css.hero }>
                                <div className={ css.heroText }>
                                    <Text rawProps={ { role: 'heading', 'aria-level': 1 } } cx={ css.heroHeader }>
                                        EPAM UUI
                                    </Text>
                                    <Text fontSize="24" cx={ css.heroSecondary }>
                                        UI development accelerator for business applications
                                    </Text>
                                    <Text fontSize="24" cx={ css.heroSecondary }>
                                        Complete set of components,
                                        guidelines, blueprints, examples, to build your apps on top of React, Figma,
                                        TypeScript
                                    </Text>
                                </div>
                                <div
                                    className={ cx(css.heroWrapper, this.state.showAnimation && containerWidth > 1280 && 'show-animation') }
                                >
                                    <div
                                        className={ css.heroImage }
                                        style={ { '--height': `${containerWidth / 2}px` } as React.CSSProperties }
                                    >
                                        { containerWidth > 1280 ? this.renderAnimatedImage() : this.renderStaticImage() }
                                    </div>
                                </div>
                            </FlexRow>
                        </div>
                    );
                } }
            </Measure>
        );
    }
}
