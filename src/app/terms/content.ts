import type { Locale } from "@/shared/lib/i18n/config";
import type { LegalPageContent } from "@/app/privacy/content";

const CONTACT_EMAIL = "mayaramaaraujo98@gmail.com";

export const termsContent: Record<Locale, LegalPageContent> = {
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: August 6, 2026",
    intro:
      "These Terms govern your use of Finkith. By creating an account or using the app, you agree to them. If you don't agree, please don't use the service.",
    sections: [
      {
        heading: "1. What Finkith is",
        paragraphs: [
          "Finkith is a tool for tracking shared income and bills within a household or group. It is not a bank, doesn't connect to your bank accounts, doesn't move or hold money, and isn't a regulated financial institution. Nothing in the app is financial, tax, or legal advice.",
        ],
      },
      {
        heading: "2. Accounts & groups",
        paragraphs: [
          "You need an account to use Finkith, and you're responsible for keeping your login credentials secure and for all activity under your account.",
          "Groups are shared spaces: when you create or join a group, other members can see the income and bill data logged in it. Group admins can manage members and remove people from the group.",
        ],
      },
      {
        heading: "3. Acceptable use",
        paragraphs: [
          "Don't use Finkith to store or share unlawful content, impersonate someone else, try to access other users' accounts or groups without authorization, or interfere with the normal operation of the service.",
        ],
      },
      {
        heading: "4. Pricing",
        paragraphs: [
          "Finkith is currently free to use. We may introduce paid plans or features in the future; if we do, we'll give existing users advance notice before any change that affects them.",
        ],
      },
      {
        heading: "5. Your data",
        paragraphs: [
          "You own the data you enter into Finkith. See our Privacy Policy for how we handle it. You can delete your data at any time from Settings.",
        ],
      },
      {
        heading: "6. Availability",
        paragraphs: [
          "Finkith is provided \"as is\" and \"as available.\" We don't guarantee the service will be uninterrupted or error-free, and we may modify or discontinue features.",
        ],
      },
      {
        heading: "7. Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, Finkith and its operator aren't liable for indirect, incidental, or consequential damages arising from your use of the service, including decisions made based on data entered by you or other group members. This doesn't limit any liability that can't be excluded under applicable EU or Brazilian (CDC) consumer-protection law.",
        ],
      },
      {
        heading: "8. Termination",
        paragraphs: [
          "You may stop using Finkith and delete your account at any time. We may suspend or terminate accounts that violate these Terms.",
        ],
      },
      {
        heading: "9. Governing law",
        paragraphs: [
          "These Terms are governed by the laws of Brazil, without prejudice to any mandatory consumer-protection rights you have under the laws of your country of residence if you're located in the EU/EEA.",
        ],
      },
      {
        heading: "10. Changes to these Terms",
        paragraphs: [
          "We may update these Terms as the service evolves. Continuing to use Finkith after a change means you accept the updated Terms.",
        ],
      },
      {
        heading: "11. Contact",
        paragraphs: [`Questions about these Terms: ${CONTACT_EMAIL}`],
      },
    ],
  },
  "pt-BR": {
    title: "Termos de Uso",
    lastUpdated: "Última atualização: 6 de agosto de 2026",
    intro:
      "Estes Termos regem o uso do Finkith. Ao criar uma conta ou usar o app, você concorda com eles. Se não concordar, por favor não use o serviço.",
    sections: [
      {
        heading: "1. O que é o Finkith",
        paragraphs: [
          "O Finkith é uma ferramenta para acompanhar renda e contas compartilhadas dentro de uma casa ou grupo. Não é um banco, não se conecta às suas contas bancárias, não movimenta nem guarda dinheiro, e não é uma instituição financeira regulada. Nada no app constitui aconselhamento financeiro, tributário ou jurídico.",
        ],
      },
      {
        heading: "2. Contas e grupos",
        paragraphs: [
          "Você precisa de uma conta para usar o Finkith, e é responsável por manter suas credenciais de login seguras e por toda atividade realizada na sua conta.",
          "Grupos são espaços compartilhados: ao criar ou entrar em um grupo, os outros membros podem ver os dados de renda e contas registrados nele. Administradores do grupo podem gerenciar membros e remover pessoas do grupo.",
        ],
      },
      {
        heading: "3. Uso aceitável",
        paragraphs: [
          "Não use o Finkith para armazenar ou compartilhar conteúdo ilegal, se passar por outra pessoa, tentar acessar contas ou grupos de outros usuários sem autorização, ou interferir no funcionamento normal do serviço.",
        ],
      },
      {
        heading: "4. Preços",
        paragraphs: [
          "O Finkith é gratuito no momento. Podemos introduzir planos ou recursos pagos no futuro; se isso acontecer, avisaremos os usuários existentes com antecedência sobre qualquer mudança que os afete.",
        ],
      },
      {
        heading: "5. Seus dados",
        paragraphs: [
          "Você é o proprietário dos dados que insere no Finkith. Veja nossa Política de Privacidade para saber como tratamos esses dados. Você pode excluir seus dados a qualquer momento em Ajustes.",
        ],
      },
      {
        heading: "6. Disponibilidade",
        paragraphs: [
          'O Finkith é fornecido "como está" e "conforme disponível". Não garantimos que o serviço será ininterrupto ou livre de erros, e podemos modificar ou descontinuar recursos.',
        ],
      },
      {
        heading: "7. Limitação de responsabilidade",
        paragraphs: [
          "Na máxima medida permitida por lei, o Finkith e seu operador não são responsáveis por danos indiretos, incidentais ou consequenciais decorrentes do uso do serviço, incluindo decisões tomadas com base em dados inseridos por você ou por outros membros do grupo. Isso não limita nenhuma responsabilidade que não possa ser excluída pela legislação de proteção ao consumidor da UE ou pelo CDC brasileiro.",
        ],
      },
      {
        heading: "8. Encerramento",
        paragraphs: [
          "Você pode parar de usar o Finkith e excluir sua conta a qualquer momento. Podemos suspender ou encerrar contas que violem estes Termos.",
        ],
      },
      {
        heading: "9. Lei aplicável",
        paragraphs: [
          "Estes Termos são regidos pelas leis do Brasil, sem prejuízo de quaisquer direitos obrigatórios de proteção ao consumidor que você tenha sob as leis do seu país de residência, caso esteja na UE/Espaço Econômico Europeu.",
        ],
      },
      {
        heading: "10. Alterações nestes Termos",
        paragraphs: [
          "Podemos atualizar estes Termos conforme o serviço evolui. Continuar usando o Finkith após uma alteração significa que você aceita os novos Termos.",
        ],
      },
      {
        heading: "11. Contato",
        paragraphs: [`Dúvidas sobre estes Termos: ${CONTACT_EMAIL}`],
      },
    ],
  },
};
