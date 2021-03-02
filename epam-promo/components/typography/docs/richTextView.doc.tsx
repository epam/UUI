import * as React from 'react';
import { RichTextView, RichTextViewMods } from '../RichTextView';
import { DefaultContext } from '../../../docs';
import { FlexRow, LabeledInput, ControlWrapper } from '../../layout';
import { LinkButton } from '../../buttons';
import { DocBuilder } from '@epam/uui-docs';
import { RichTextViewProps } from '@epam/uui-components';
import { Anchor } from '../../navigation';
import { Svg } from '@epam/uui-components';
import * as calendar from '@epam/assets/icons/common/action-calendar-18.svg';
import { TextInput } from '../../inputs';
import cx from 'classnames';
import * as css from '../../../assets/styles/typography.scss';
import * as style from './richTextViewDoc.scss';

const textDoc = new DocBuilder<RichTextViewProps & RichTextViewMods>({ name: 'RichTextView', component: RichTextView as React.ComponentClass<any> })
    .prop('htmlContent', {
        examples: [
            { value: '<h1>Hello</h1>', isDefault: false, name: '<h1>' },
            {
                value: ' <h2>Hello</h2>',
                name: '<h2>',
            },
        ], type: 'string',
    })
    .prop('size', { examples: [
        { value: '12', isDefault: false, name: '12'},
        { value: '14', isDefault: true, name: '14'},
        { value: '16', isDefault: false, name: '16'},
    ]})
    .prop('children', {
        examples: [
            {
                value: <div style={ { maxWidth: "1100px" } } className={ style.container }>
                    <h2>Promo Headlines</h2>
                    <div className='hero-header'>Hero HEADING — Hero <br/> for super-promo screens</div>
                    <h2 className='promo-header'>Promo heading — H2 <br/> for page hero-headers</h2>
                    <h3 className='promo-header'>Promo heading — H3 <br/> for areas smaller than hero-headers</h3>
                    <h2>Headlines</h2>
                    <h1>Heading — H1 <br/> for page hero-headers</h1>
                    <h2>Heading — H2 <br/> for areas smaller than hero-headers</h2>
                    <h3>Large area heading — H3 <br/> for big cards or free space areas</h3>
                    <h4>Medium area heading — H4 <br/> for thin/small cards and areas</h4>
                    <h5>Small area heading — H5 <br/> for small cards as attention drawer</h5>
                    <h6>Super small heading or accent — Emphasis <br/> for title or label of lists</h6>
                    <h2>Example text</h2>
                    <p>
                        <b>Main text</b> — Default is here… Further is a fish → While it was just a TV show, that little speech at the beginning
                        of the original Star Trek show really did do a good job if capturing our feelings about space.
                        cillum dolore eu fugiat nulla pariatur. <Anchor href="/">Click me <Svg svg={ calendar }></Svg></Anchor> It is those feelings that drive
                        our love of astronomy and our desire to learn more and more about it.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <code>{ `import { Button } from '@epam/loveship'` }</code>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                        But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete
                        account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No
                        one rejects, dislikes, or avoids pleasure itself, <i>because it is pleasure</i>, but because those who do not know how to pursue pleasure
                        rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain
                        of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.
                        To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has
                        any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces
                        no resultant pleasure
                    </p>
                    <b>Title of the list:</b>
                    <ul>
                        <li>He is passionate about his profession
                            <ul>
                                <li>He is <q>passionate about his profession</q></li>
                                <li>Pavel <s>seems to be flexible when</s></li>
                                <li><i>The candidate is sociable and speaks English well</i></li>
                            </ul>
                        </li>
                        <li>Pavel seems to be flexible when
                            <ol>
                                <li>He is passionate about his profession</li>
                                <li>Pavel seems to be flexible when</li>
                                <li>The candidate is sociable and speaks English well</li>
                            </ol>
                        </li>
                        <li>The candidate is sociable and speaks English well</li>
                        <li>He is passionate about his profession, Pavel is oriented in professional information resources and webinars for  growth as a professional. He is passionate about his profession, Pavel is oriented in professional information resources and webinars for  growth as a professional.</li>
                        <li>Pavel seems to be flexible when achieving the result and ready to accept conditions for projects.</li>
                        <li>The candidate is sociable and speaks English well. He works at the customer side and negotiates with regard to business goals and his individual. </li>
                    </ul>
                    <i>Additional data, unnecessary info, caption or quote.</i> <Anchor>Links and tags are looks like this.</Anchor>
                    <h4>LabeledInput</h4>
                    <FlexRow>
                        <LabeledInput size='36' label={ <>Demo Component<Anchor href="/"><Svg svg={ calendar }></Svg></Anchor> : </> }>
                            <ControlWrapper size='36'>
                                <TextInput value="" onValueChange={ () => {} }></TextInput>
                            </ControlWrapper>
                            If you have no goals to choose, add them on { <Anchor href="/">Home</Anchor> }.
                        </LabeledInput>
                    </FlexRow>
                    <h4>LinkButton</h4>
                    <FlexRow>
                        <LinkButton caption="BUTTON-LINK"></LinkButton>
                        <LinkButton caption="SHARE"></LinkButton>
                        <LinkButton caption="ADD"></LinkButton>
                    </FlexRow>
                    <h4>{ "<Pre>" }</h4>
                    <pre>{ `import * as React from 'react';
import * as css from './MyComponent.scss';

export const MyComponent = <div className={ css.myHeader }>` }</pre>
                    <h4>Text with size 16</h4>
                    <p className={ cx(css.typography16) }>
                        Lorem ipsum dolor sit amet, <Anchor href="/">click me <Svg svg={ calendar }></Svg></Anchor> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <code>{ `import { Button } from '@epam/loveship'` }</code>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <h4>Text with size 12</h4>
                    <p className={ cx(css.typography12) }>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, <Anchor href="/">click me <Svg svg={ calendar }></Svg></Anchor> quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure reprehenderit in voluptate velit esse cillum
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <code>{ `import { Button } from '@epam/loveship'` }</code>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>, isDefault: true, name: 'Demo',
            },
            {
                value: <>You can use it for <b><i>simple text</i></b></>, name: 'Simple text',
            },
        ],
    })
    .withContexts(DefaultContext);

export = textDoc;
