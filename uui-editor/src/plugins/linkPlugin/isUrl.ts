const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const emailLintRE = /mailto:([^\?]*)/;

const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

export const isUrl = (string: any) => {
    if (typeof string !== 'string') {
        return false;
    }

    const generalMatch = string.match(protocolAndDomainRE);
    // TODO: move to plate
    const matchEmailLink = string.match(emailLintRE);
    const match = generalMatch || matchEmailLink;
    if (!match) {
        return false;
    }

    const everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }

    try {
        new URL(string);
    } catch (err) {
        return false;
    }

    const x = localhostDomainRE.test(everythingAfterProtocol);
    const y = nonLocalhostDomainRE.test(everythingAfterProtocol);

    return x || y;
};
