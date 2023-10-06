import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import scrollToElement from 'animated-scroll-to';
import moment from 'moment';
import ModalContext from 'contexts/modal';
import { lockBodyScrolling, clearBodyScrollLocks } from 'helpers/bodyScrollLock';
import { findDeep } from 'helpers/objects';
import findReactChildren from 'helpers/findReactChildren';
import useRepeatFor from 'hooks/useRepeatFor';
import useEffectWithoutMount from 'hooks/useEffectWithoutMount';
import useFormReducer from 'hooks/useFormReducer';
import useKeyHandlers from 'hooks/useKeyHandlers';
import Close from 'atoms/Close';
import Button from 'atoms/Button';
import Error from 'atoms/Error';
import Collapsible from 'molecules/Collapsible';
import Screen from './Modal/Screen';

const Modal = (props) => {
    const location = useLocation();
    const [exitingScreen, setExitingScreen] = useState(null);
    const [activeScreen, setActiveScreen] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [unhandledErrors, setUnhandledErrors] = useState(null);
    const [lastConfirmationTime, setLastConfirmationTime] = useState(null);
    const bodyRef = useRef();
    const validatorsRef = useRef({});
    const confirmCallbackRef = useRef(props.onConfirm);
    const [formValues, setFormValue, formValuesRef] = useFormReducer({
        subject: props.formSubject,
        dependsOn: [props.isOpen, props.formSubject?.id],
        config: props.formConfig,
    });
    const repeat = useRepeatFor(300);
    const screens = findReactChildren(props.children, { formValues, setFormValue });
    const visibleScreen = exitingScreen ?? activeScreen;
    const isLastScreen = visibleScreen === screens.length - 1;

    useEffect(() => {
        if (props.alwaysOpen) {
            focusFirstInput();
        }

        return () => {
            clearBodyScrollLocks();
        };
    }, []);

    useEffect(() => {
        if (props.isOpen) {
            lockBodyScrolling(bodyRef.current);
        } else {
            clearBodyScrollLocks();
            setActiveScreen(0);
            setErrors({});
            setUnhandledErrors(null);
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (activeScreen !== null) {
            window.setTimeout(focusFirstInput, 300);
        }
    }, [activeScreen]);

    useEffect(() => {
        confirmCallbackRef.current = props.onConfirm;
    }, [props.onConfirm]);

    useEffect(() => {
        window.setTimeout(() => {
            const errorElement = bodyRef.current?.querySelector('.ui-form-item--has-error .ui-error');

            if (errorElement) {
                scrollTo(errorElement);
            }
        }, 1);
    }, [lastConfirmationTime]);

    useEffectWithoutMount(() => {
        if (!props.alwaysOpen) {
            props.close();
        }
    }, [location.pathname]);

    useKeyHandlers({
        handlers: [{
            key: 'Escape',
            handler: props.close,
        }],
        active: props.isOpen,
    });

    const scrollTo = (element) => {
        const verticalOffset = 40;

        repeat(() => {
            if (!bodyRef.current) {
                return;
            }

            if (
                bodyRef.current.scrollTop > element.offsetTop - verticalOffset
                || bodyRef.current.offsetHeight + bodyRef.current.scrollTop < element.offsetTop + element.offsetHeight + verticalOffset
            ) {
                scrollToElement(
                    element,
                    {
                        maxDuration: 300,
                        verticalOffset: -verticalOffset,
                        cancelOnUserAction: false,
                        elementToScroll: bodyRef.current,
                    },
                );
            }
        });
    };

    const focusFirstInput = () => {
        if (!bodyRef.current) {
            return;
        }

        // A bit hacky but the least intrusive way to focus the first input field of each content screen
        const firstInput = bodyRef.current.querySelector(`.ui-collapsible:nth-child(${activeScreen + 1}) input:not([readonly])`);

        if (firstInput) {
            firstInput.select();
        }
    };

    const confirm = async () => {
        if (activeScreen === null || loading) {
            return;
        }

        setLastConfirmationTime(moment().toISOString());

        const validationErrors = validateFrontendErrors();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            return;
        }

        if (isLastScreen) {
            const confirmPromise = confirmCallbackRef.current(formValuesRef.current);

            if (confirmPromise?.then) {
                setLoading(true);

                try {
                    await confirmPromise;
                } catch (validatingErrors) {
                    const [serverErrors, unhandledServerErrors] = validateServerErrors(validatingErrors);

                    console.log(validatingErrors);
                    setErrors(serverErrors);
                    setUnhandledErrors(unhandledServerErrors.length > 0 ? unhandledServerErrors : null);
                }

                setLoading(false);
            }
        } else {
            changeScreen(activeScreen + 1);
        }
    };

    const validateFrontendErrors = () => (
        Object.entries(validatorsRef.current).reduce((result, [name, { validators }]) => {
            for (let i = 0; i < validators.length; i += 1) {
                const { isValid, skip, serverError } = validators[i];

                if (serverError || (skip && skip())) {
                    continue;
                }

                const validatorData = {
                    input: formValues,
                    name,
                    value: findDeep(formValues, name),
                };

                if (!isValid(validatorData)) {
                    return { ...result, [name]: validators[i] };
                }
            }

            return result;
        }, {})
    );

    const validateServerErrors = (validatingErrors) => {
        if (!validatingErrors.graphQLErrors && !validatingErrors.isAxiosError) {
            throw validatingErrors;
        }

        const errorCodes = validatingErrors.graphQLErrors?.map((error) => error.extensions.code || error.message);
        let serverErrors = {};
        let errorScreen = null;

        if (validatorsRef.current) {
            Object.entries(validatorsRef.current).forEach(([name, { validators, screen }]) => {
                validators.forEach((validator) => {
                    if (validator.serverError && Object.keys(serverErrors).length === 0) {
                        validatingErrors.graphQLErrors?.forEach((error) => {
                            const validatorData = {
                                input: formValues,
                                name,
                                value: findDeep(formValues, name),
                                data: error.extensions.data,
                            };

                            if (
                                validator.serverError === error.extensions.code
                                && (!validator.isValid || !validator.isValid(validatorData))
                            ) {
                                serverErrors = {
                                    ...serverErrors,
                                    [name]: {
                                        ...validator,
                                        data: error.extensions.data,
                                    },
                                };
                            }
                        });

                        if (validatingErrors.isAxiosError) {
                            let error;

                            if (validatingErrors.config.responseType === 'arraybuffer') {
                                error = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(validatingErrors.response.data)));
                            } else if (validatingErrors.config.responseType === 'json') {
                                error = validatingErrors.response.data;
                            } else {
                                error = {
                                    message: validatingErrors.message,
                                };
                            }

                            const validatorData = {
                                input: formValues,
                                name,
                                value: findDeep(formValues, name),
                                data: error.extensions.data,
                            };

                            if (
                                validator.serverError === error.extensions.code
                                && (!validator.isValid || !validator.isValid(validatorData))
                            ) {
                                serverErrors = {
                                    ...serverErrors,
                                    [name]: {
                                        ...validator,
                                        data: error.extensions.data,
                                    },
                                };
                            }
                        }

                        if (Object.keys(serverErrors).length > 0) {
                            errorScreen = screen;
                        }
                    }
                });
            });
        }

        if (errorScreen !== null && errorScreen !== activeScreen) {
            changeScreen(errorScreen);
        }

        const unhandledServerErrors = errorCodes.filter((code) => (
            !Object.values(serverErrors).some(({ serverError }) => serverError === code)
        ));

        return [serverErrors, unhandledServerErrors];
    };

    const previousScreen = () => {
        if (activeScreen === null) {
            return;
        }

        changeScreen(Math.max(0, activeScreen - 1));
    };

    const changeScreen = (value) => {
        setExitingScreen(activeScreen);
        setActiveScreen(null);
        setErrors({});
        setUnhandledErrors(null);

        window.setTimeout(() => {
            setExitingScreen(null);
            setActiveScreen(value);
        }, 300);
    };

    const modalContextValueHandler = (screen) => ({
        confirm,
        errors,
        formValues,
        setFormValue,
        scrollTo,
        setErrorMessageHandler: (key) => (message) => {
            setErrors({
                [key]: {
                    message,
                    alwaysShow: true,
                },
            });
        },
        registerValidators: (name, validators) => {
            if (validators) {
                validatorsRef.current[name] = { screen, validators };
            }
        },
        deregisterFrontendValidators: (name) => {
            if (validatorsRef.current[name]) {
                validatorsRef.current[name].validators = validatorsRef.current[name].validators.filter(({ serverError }) => !!serverError);
            }
        },
    });

    const renderContent = () => (
        <div
            className={classNames(
                'ui-modal',
                {
                    'ui-modal--always-open': props.alwaysOpen,
                    'ui-modal--loading': loading,
                    'ui-modal--transitioning': activeScreen === null,
                },
            )}
        >
            <div className="ui-modal__container">
                {!props.alwaysOpen && (
                    <div className="ui-modal__overlay" />
                )}

                <div className="ui-modal__wrapper">
                    <div className="ui-modal__content">
                        <div className="ui-modal__header">
                            <TransitionGroup component={React.Fragment}>
                                {activeScreen !== null && (
                                    <CSSTransition
                                        classNames="ui-modal__header-content-"
                                        mountOnEnter
                                        timeout={400}
                                        unmountOnExit
                                    >
                                        <div className="ui-modal__header-content">
                                            {screens[visibleScreen]?.props.headline}
                                        </div>
                                    </CSSTransition>
                                )}
                            </TransitionGroup>
                        </div>

                        <div
                            ref={bodyRef}
                            className={classNames(
                                'ui-modal__body',
                                { 'ui-modal__body--empty': !props.children },
                            )}
                        >
                            {screens.map((screen, index) => (
                                <Collapsible
                                    key={index}
                                    collapsed={index !== activeScreen}
                                >
                                    <ModalContext.Provider value={modalContextValueHandler(index)}>
                                        {screen}

                                        <Collapsible collapsed={!unhandledErrors}>
                                            <div className="ui-modal__unhandled-error">
                                                <Error>
                                                    Leider ist ein unbehandelter Fehler aufgetreten.

                                                    Fehlermeldung: {unhandledErrors?.join(', ')}
                                                </Error>
                                            </div>
                                        </Collapsible>
                                    </ModalContext.Provider>
                                </Collapsible>
                            ))}
                        </div>
                    </div>

                    <div className="ui-modal__buttons">
                        {visibleScreen > 0 && (
                            <Button
                                light
                                onClick={previousScreen}
                            >
                                Zurück
                            </Button>
                        )}

                        {props.onConfirm && (
                            <Button onClick={confirm}>
                                {isLastScreen ? props.confirmButtonLabel : 'Weiter'}
                            </Button>
                        )}
                    </div>
                </div>

                {!props.alwaysOpen && (
                    <Close onClick={props.close} />
                )}
            </div>
        </div>
    );

    if (props.alwaysOpen) {
        return renderContent();
    }

    return (
        <TransitionGroup component={React.Fragment}>
            {props.isOpen && (
                <CSSTransition
                    classNames="ui-modal-"
                    mountOnEnter
                    timeout={300}
                    unmountOnExit
                >
                    {renderContent()}
                </CSSTransition>
            )}
        </TransitionGroup>
    );
};

Modal.defaultProps = {
    alwaysOpen: false,
    children: null,
    close: null,
    confirmButtonLabel: null,
    destructive: false,
    formConfig: null,
    formSubject: null,
    isOpen: false,
    onConfirm: null,
};

Modal.propTypes = {
    alwaysOpen: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    close: PropTypes.func,
    confirmButtonLabel: PropTypes.node,
    destructive: PropTypes.bool,
    formConfig: PropTypes.object,
    formSubject: PropTypes.object,
    isOpen: PropTypes.bool,
    onConfirm: PropTypes.func,
};

export default Modal;
export { Screen };
