import Logger from "@/server/util/Logger.ts";
import {createTransport, type Transporter} from "nodemailer";
import QueueWorker from "@/shared/util/QueueWorker.ts";

const mailerConfig = {
    smptHost: Bun.env.MAILER_SMTP || '',
    port: Bun.env.MAILER_SMTP_PORT ? parseInt(Bun.env.MAILER_SMTP_PORT) : 465,
    user: Bun.env.MAILER_USER || '',
    password: Bun.env.MAILER_PASS || '',
    senderName: Bun.env.MAILER_SENDER_NAME || '',
    senderAddress: Bun.env.MAILER_SENDER_ADDRESS || '',
    batchInterval: Bun.env.MAILER_INTERVAL ? parseInt(Bun.env.MAILER_INTERVAL) : 60,
    batchSize: Bun.env.MAILER_BATCH ? parseInt(Bun.env.MAILER_BATCH) : 5,
} as const;

type Mail = {
    receiver: string;
    subject: string;
    contentText: string
    contentHTML?: string
};

class Mailer {

    private readonly mailTransporter: Transporter|undefined;
    private readonly mailWorker: QueueWorker<Mail>;

    constructor() {
        Logger.debug("Initiating mailer: ", mailerConfig);

        if (mailerConfig.smptHost !== '') {
            // create mailing service
            this.mailTransporter = createTransport({
                host: mailerConfig.smptHost,
                port: mailerConfig.port,
                secure: mailerConfig.smptHost !== "mailhog",
                auth: {
                    user: mailerConfig.user,
                    pass: mailerConfig.password
                }
            });
        }
        // create queue worker
        this.mailWorker = new QueueWorker<Mail>(
            this.sendMailCallback.bind(this),
            mailerConfig.batchInterval * 1000,
            mailerConfig.batchSize
        );
    }

    public sendMail(mail: Mail): void {
        this.mailWorker.push(mail);
        Logger.debug("Elements in mail queue: " + this.mailWorker.length);
    }

    private printMail(mail: Mail): void {
        Logger.warning("Trying to send mail while no mailer configured. Fallback to INFO log");
        Logger.info(
            `Receiver: ${mail.receiver}\n` +
            `Subject: ${mail.subject}\n` +
            `Content:\n${mail.contentText}\n`
        );
    }

    private async sendMailCallback(mails: Mail[]): Promise<void> {
        if (!this.mailTransporter) {
            mails.forEach(mail => this.printMail(mail));
            return;
        }

        const mailPromises: Promise<void>[] = [];

        for (const mail of mails) {
            Logger.debug(`Sending mail: ${mail.subject}`);
            const mailPromise = this.mailTransporter.sendMail({
                from: `"${mailerConfig.senderName}" ${mailerConfig.senderAddress}`,
                to: mail.receiver,
                subject: mail.subject,
                text: mail.contentText,
                html: mail.contentHTML || mail.contentText,
            });
            mailPromises.push(mailPromise);
        }

        await Promise.all(mailPromises);
    }
}


const mailer = new Mailer();
export default mailer;


export function sendTestMail(receiver: string): void {
    mailer.sendMail({
        receiver: receiver,
        subject: "Test!",
        contentText: "This is how the Email can look\nin plain text",
        contentHTML: "<p>This is how the Email can look</p><p>in <b>HTML</b> text</p>",
    });
}