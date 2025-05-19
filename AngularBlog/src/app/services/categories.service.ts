import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore,private toastr:ToastrService) {}
  saveData(data){
    this.afs.collection('categories').add(data).then((docRef) => {
      console.log(docRef);
      this.toastr.success('category Insert Successfully..!');
    })
    .catch(err=>{console.log(err);});
  }
  loadData():Observable<Object>{
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data }
      })
   })
  )
 }

 updateData(id,EditData){
  this.afs.doc(`categories/${id}`).update(EditData).then((docRef) => {
    this.toastr.success('Data Update Successfully..!')
  })
 }
 deleteData(id){
  this.afs.doc(`categories/${id}`).delete().then((docRef) => {
    this.toastr.success('Data Delete Successfully..!');
  })
}
}
