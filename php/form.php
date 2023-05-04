<!DOCTYPE html>
<html  lang="fr-FR">
  <head>
    <meta charset="UTF-8">
    <title>Requête envoyée</title>
    <link rel="stylesheet" type="text/css" href="style.css">
  <meta http-equiv="refresh" content="5;url=https://cheeked-centerlines.000webhostapp.com/" />
  </head>
  <body>       
      <!--Contact php contact principale-->
      <?php
      
      if (isset($_POST['message'])) {
        $entete  = 'MIME-Version: 1.0' . "\r\n";
        $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $entete .= "From: no-reply@manifestdesign.fr" . "\r\n" .
                   'Reply-to: ' . $_POST['email'];

        $name = htmlspecialchars($_POST['name']);
        $email = htmlspecialchars($_POST['email']);
        $message = htmlspecialchars($_POST['message']);
        $subject = htmlspecialchars($_POST['subject']);

        // Valider les entrées du formulaire
        if (empty($name) || empty($email) || empty($message)) {
          echo 'Tous les champs sont obligatoires';
        } else {
          // Vérifier si l'adresse email est valide
          if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo 'Adresse email non valide';
          } else {
            // Vérifier si le champ caché est vide
            if (!empty($_POST['spam_check'])) {
              echo 'Soumission de spam détectée';
            } else {
              // Envoyer le message
              $message_body = '<h3>Message envoyé depuis la page Contact de manifestdesign.fr</h3>
                              <p>
                                Nom : </b>' . $name . '</br>
                                Email : </b>' . $email . '</br>
                                Sujet : </b>' . $subject . '</br>
                                Message : </b>' . $message . '</p>';

              $retour = mail('dylan.lefebvre76@live.com', 'Envoi depuis page Contact', $message_body, $entete);
              if ($retour) {
                echo '   
                <div class="main-container">
                <div class="check-container">
                  <div class="check-background">
                    <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 25L27.3077 44L58.5 7" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="check-shadow"></div>
                </div>
                <h1>Votre demande a bien été enregistrée et sera examinée par notres bureau dans les plus brefs délais</h1>
                <p>Renvoi automatique vers la page d\'accueil</p>
              </div>';
                header('Refresh: 5; url=https://cheeked-centerlines.000webhostapp.com/');
              } else {
                echo 'Erreur lors de l\'envoi du message';
              }
            }
          }
        }
      }
    ?>
      <!-- End Contact php-->
      <!-- Votre demande a bien été enregistrée et sera examinée dans les plus brefs délais
                        Renvoi automatique vers la page d\'accueil -->
    <!--Contact php contact Newsletters-->
<?php
  if (isset($_POST['submit'])) {
    $entete  = 'MIME-Version: 1.0' . "\r\n";
    $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $entete .= "From: no-reply@manifestdesign.fr" . "\r\n" .
               'Reply-to: ' . $_POST['email'];

    $message = '<h3>Bonjour Ilhame, cette personne souhaite faire partie de ta Newsletters</h3>
                <p>Email : <b>' . $_POST['email'] . '</b></p>';

    $retour = mail('newsletters@manifestdesign.fr', 'Un nouvel abonné pour ta newsletter', $message, $entete);  

    if ($retour) {
      echo '
        <div class="main-container">
          <div class="check-container">
            <div class="check-background">
              <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 25L27.3077 44L58.5 7" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="check-shadow"></div>
          </div>
          <h1>Votre inscription a bien été prise en compte</h1>
          <p>Renvoi automatique vers la page d\'accueil</p>
        </div>
      ';
    } else {
      echo 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.';
    }
  } else {
    echo 'Le formulaire n\'a pas été soumis.';
  }
?>
<!-- End Contact php-->


  </body>
</html>

      
   