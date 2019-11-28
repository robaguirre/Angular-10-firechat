import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = [];
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    // Nos suscribimos a este metodo para ecuchar cualquier cambio en el estado de la autenticacion.
    this.afAuth.authState.subscribe(user => {
      console.log('Estado usuario', user);
      if (!user) { return; }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  cargarMensajes(): Observable<any> {
    // Obtengo los ultmos 5 pero descendente. Luego ordenamos por JS
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(8));

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        // console.log(mensajes);
        // this.chats = mensajes;
        this.chats = [];
        for (let mensaje of mensajes) {
          // Los insertamos alreves
          this.chats.unshift(mensaje);
        }
        return this.chats;
      })
    );
  }

  agregarMensaje(texto: string): Promise<any> {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };
    return this.itemsCollection.add(mensaje);
  }

  login(proveedor: string) {
    // Solo con google ya que no hay acceso a Twitter
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

}
