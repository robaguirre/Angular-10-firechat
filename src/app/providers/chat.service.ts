import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = [];
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore) { }

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
      nombre: 'Roberto prueba',
      mensaje: texto,
      fecha: new Date().getTime(),
    };
    return this.itemsCollection.add(mensaje);
  }

}
