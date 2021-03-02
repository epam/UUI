import * as React from 'react';
import Measure from 'react-measure';
import { cx } from '@epam/uui';
import { FlexRow, Text } from '@epam/promo';
import * as css from './HeroBlock.scss';

export interface HeroBlockProps {
}

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
        setTimeout(() => this.setState(state => ({
            showAnimation: !state.showAnimation,
        })), timeout);
    }

    renderStaticImage = () => {
        return (
            <img alt='image' src='/static/images/hero_image.png' width='100%' />
        );
    }

    renderAnimatedImage = () => {
        return (
            <>
                <div style={ { width: '100%' } } >
                    <img alt='image' src='/static/images/Background.png' width='100%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.search } alt='image' src='/static/images/120_192.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_1 } alt='image' src='/static/images/120_390.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_2 } alt='image' src='/static/images/426_444.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_3 } alt='image' src='/static/images/732_444.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_4 } alt='image' src='/static/images/1038_444.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_5 } alt='image' src='/static/images/426_744.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_6 } alt='image' src='/static/images/732_744.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_7 } alt='image' src='/static/images/1038_744.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_8 } alt='image' src='/static/images/426_1044.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_9 } alt='image' src='/static/images/732_1044.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_10 } alt='image' src='/static/images/1038_1044.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_11 } alt='image' src='/static/images/426_1344.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_12 } alt='image' src='/static/images/732_1344.png' width='20%' />
                </div>
                <div style={ { width: '100%' } } >
                    <img className={ css.layer_13 } alt='image' src='/static/images/1038_1344.png' width='20%' />
                </div>
            </>
        );
    }

    componentDidMount() {
        this.toggleAnimation(1000);
        this.toggleAnimation(3000);
    }

    render() {
        return (
            <Measure bounds >
                {
                    ({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any, contentRect: any }) => {
                        const containerWidth = window ? window.innerWidth : contentRect.bounds.width;

                        return (
                            <div className={ css.layout } ref={ measureRef } >
                                <FlexRow  cx={ css.hero }>
                                    <div className={ css.heroText }>
                                        <Text font='museo-slab' cx={ css.heroHeader } >Unified UI</Text>
                                        <Text font='sans' fontSize='24' cx={ css.heroSecondary } >Digital Platform UX/UI accelerator used to build all EPAM internal products in one effective & consistent way.</Text>
                                        <Text font='sans' fontSize='24' cx={ css.heroSecondary } >No more need to build user interface from scratch every time. Just use "lego blocks" to assemble new pages in a quick way for any current or new EPAM product.</Text>
                                    </div>
                                    <div className={ cx(css.heroWrapper, this.state.showAnimation && containerWidth > 1280 && 'show-animation') } >
                                        <div className={ css.heroImage } style={ { ['--height' as any]: `${ containerWidth / 2 }px` } } >
                                            { containerWidth > 1280 ? this.renderAnimatedImage() : this.renderStaticImage() }
                                        </div>
                                    </div>
                                </FlexRow>
                            </div>
                        );
                    }
                }
            </Measure>
        );
    }
}
