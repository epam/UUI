import React from 'react';
import { Anchor, FlexRow, LabeledInput, LinkButton, RichTextView, TextInput } from '@epam/uui';

export default function BasicExample() {
    return (
        <RichTextView>
            <h3>
                <strong>Standart Headlines</strong>
            </h3>
            <h1>H1 - Heading (for page hero-headers)</h1>
            <h2>H2 - Heading (for areas smaller than hero-headers)</h2>
            <h3>H3 - Large area heading (for big cards or free space areas)</h3>
            <h4>H4 - Medium area heading (for thin/small cards and areas)</h4>
            <h5>H5 - Small area heading (for small cards as attention drawer)</h5>
            <h6>H6 - Super small heading or accent — Emphasis (for title or label of lists)</h6>
            <h3>
                <strong>Promo Headlines</strong>
            </h3>
            <div className="hero-header">
                Hero HEADING — Hero
                {' '}
                <br />
                {' '}
                for super-promo screens
            </div>
            <h2 className="promo-header">
                Promo heading — H2
                {' '}
                <br />
                {' '}
                for page hero-headers
            </h2>
            <h3 className="promo-header">
                Promo heading — H3
                {' '}
                <br />
                {' '}
                for areas smaller than hero-headers
            </h3>
            <h1>Example text with headline h1</h1>
            <h2>And additional headline h2</h2>
            <p>
                <b>Main text</b>
                {' '}
                — Default is here… Further is a fish → While it was just a TV show, that little speech at the beginning of the original Star Trek
                show really did do a good job if capturing our feelings about space. cillum dolore eu fugiat nulla pariatur.
                {' '}
                <Anchor href="/">
                    Click me
                    {' '}
                </Anchor>
                {' '}
                It is those feelings that drive our love of astronomy and our desire to learn more and more about it.
            </p>
            <p>
                <code>{'import { Button } from \'@epam/loveship\''}</code>
                {' '}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                <code>{'import { Button } from \'@epam/loveship\''}</code>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h2>Example text with headline h2</h2>
            <h3>And additional headline h3</h3>
            <p>
                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the
                system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or
                avoids pleasure itself,
                {' '}
                <i>because it is pleasure</i>
                , but because those who do not know how to pursue pleasure rationally encounter consequences that
                are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because
                occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes
                laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure
                that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure
            </p>
            <h2>Analysing Potential Problems</h2>
            <figure>
                <img src="/static/images/DemoTable.png" alt="" />
                <figcaption>Some image caption</figcaption>
            </figure>
            <p>
                Physiological respiration involves the mechanisms that ensure that the composition of the functional residual capacity is kept constant, and
                equilibrates with the gases dissolved in the pulmonary capillary blood, and thus throughout the body.
            </p>
            <b>Title of the list:</b>
            <ul>
                <li>
                    He is passionate about his profession
                    <ul>
                        <li>
                            He is
                            {' '}
                            <q>passionate about his profession</q>
                        </li>
                        <li>
                            Pavel
                            {' '}
                            <s>seems to be flexible when</s>
                        </li>
                        <li>
                            <i>The candidate is sociable and speaks English well</i>
                            <ul>
                                <li>
                                    One more inside lists
                                    {' '}
                                    <u>with underline text</u>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    Pavel seems to be flexible when
                    <ol>
                        <li>He is passionate about his profession</li>
                        <li>Pavel seems to be flexible when</li>
                        <li>The candidate is sociable and speaks English well</li>
                    </ol>
                </li>
                <li>The candidate is sociable and speaks English well</li>
                <li>
                    He is passionate about his profession, Pavel is oriented in professional information resources and webinars for growth as a professional. He is
                    passionate about his profession, Pavel is oriented in professional information resources and webinars for growth as a professional.
                </li>
                <li>Pavel seems to be flexible when achieving the result and ready to accept conditions for projects.</li>
                <li>
                    The candidate is sociable and speaks English well. He works at the customer side and negotiates with regard to business goals and his individual.
                    {' '}
                </li>
            </ul>
            <i>Additional data, unnecessary info, caption or quote.</i>
            {' '}
            <Anchor href="#">Links and tags are looks like this.</Anchor>
            <h3>LabeledInput</h3>
            <FlexRow>
                <LabeledInput
                    size="36"
                    label={
                        <>
                            Demo Component:
                            {' '}
                        </>
                    }
                >
                    <TextInput value="" onValueChange={ () => {} }></TextInput>
                    If you have no goals to choose, add them on
                    {' '}
                    <Anchor href="/">Home</Anchor>
                    .
                </LabeledInput>
            </FlexRow>
            <h4>LinkButton</h4>
            <FlexRow columnGap="12">
                <LinkButton caption="BUTTON-LINK"></LinkButton>
                <LinkButton caption="SHARE"></LinkButton>
                <LinkButton caption="ADD"></LinkButton>
            </FlexRow>
            <h4>Text with size 16</h4>
            <p className="uui-typography-size-16">
                Lorem ipsum dolor sit amet,
                {' '}
                <Anchor href="/">
                    click me
                </Anchor>
                {' '}
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                {' '}
                <code>{'import { Button } from \'@epam/loveship\''}</code>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="uui-typography-size-16">
                Lorem ipsum dolor sit amet,
                {' '}
                <Anchor href="/">
                    click me
                </Anchor>
                {' '}
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                {' '}
                <code>{'import { Button } from \'@epam/loveship\''}</code>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h4>Text with size 12</h4>
            <p className="uui-typography-size-12">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                {' '}
                <Anchor href="/">
                    click me
                </Anchor>
                {' '}
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure reprehenderit in voluptate velit esse cillum dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                {' '}
                <code>{'import { Button } from \'@epam/loveship\''}</code>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="uui-typography-size-12">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                {' '}
                <Anchor href="/">
                    click me
                </Anchor>
                {' '}
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure reprehenderit in voluptate velit esse cillum dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                {' '}
                <code>{'import { Button } from \'@epam/loveship\''}</code>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </RichTextView>
    );
}
