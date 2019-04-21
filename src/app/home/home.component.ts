import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="uk-background-muted uk-padding uk-panel">
      <p>
        <span uk-icon="info"></span> &nbsp;<strong>ffbe{{ '{' }}progress{{ '}' }}</strong>
        est un outil qui vous permet de gérer votre avancement dans le jeu mobile FF Brave Exvius.
      </p>
      <p>Voici les défis qui sont actuellement gérés :</p>
      <ul>
          <li>Défis des différentes chambres</li>
          <li>Défis des chimères</li>
          <li>Défis liés à l'histoire</li>
        </ul>
    </div>

    <div class="uk-child-width-expand@s uk-text-center uk-margin-large-top uk-margin-bottom" uk-grid>
      <div>
        <h3>Connexion facile</h3>
        <p>Pas besoin de vous inscrire, connectez-vous en un seul clic en passant par Google.</p>
      </div>
      <div>
        <h3>Trials et points</h3>
        <p>Indiquez les trials que vous avez terminé.
        Si vous avez fait les missions associées,
        cela vous rapportera encore plus de points.</p>
      </div>
      <div>
        <h3>Partage de profil</h3>
        <p>Sauvegardez votre score, partagez votre lien de profil et
        découvrez votre position dans le classement parmi les autres joueurs.</p>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
