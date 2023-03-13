
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {UUID} from "angular2-uuid";
import {pageProduct, Product} from "../model/product.model";
import {ValidationErrors} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products! :  Array<Product>;

  constructor() {
    this.products = [
      { id : UUID.UUID(), name : "computer", price : 159000 , promotion : true},
      { id : UUID.UUID(), name : "printer", price : 1589000 , promotion : false},
      { id : UUID.UUID(), name : "car", price : 2500000  , promotion : true},
      { id : UUID.UUID(), name : "smart phone", price : 1590500 , promotion: false},
    ];
    for (let i = 0; i<20; i++) {
      this.products.push({id: UUID.UUID(), name: "computer", price: 159000, promotion: true});
      this.products.push({id: UUID.UUID(), name: "printer", price: 1589000, promotion: false});
      this.products.push({id: UUID.UUID(), name: "car", price: 2500000, promotion: true});
      this.products.push({id: UUID.UUID(), name: "smart phone", price: 1590500, promotion: false});
    }

  }

 public getAllProducts() : Observable<Array<Product>> {
  let rnd =Math.random();
  if(rnd<0.1)
    return throwError(()=>new Error("internet connexion error"));
  else
    return of([...this.products]);
  }

  public getPageProducts(page : number, size: number) : Observable<pageProduct> {
    let  totalPages = ~~(this.products.length/size);
    let index = page*size;
    if(this.products.length % size != 0 )
      totalPages++;
    let pageProducts = this.products.slice(index, index+size);
    return of({page : page, size:size, totalPages:totalPages, products: pageProducts});
  }

  public deleteProduct( id :string) : Observable<boolean>{
   this.products =  this.products.filter(p=>p.id != id );
   return of(true);
  }
   public setPromotion(id:string) : Observable<boolean>{
    let product = this.products.find(p=>p.id == id);
    if (product != undefined){
      product.promotion = !product.promotion;
      return of(true);

    }else {
      return throwError( ()=> new Error("product not found"));
    }
   }

  public  searchProducts( keyword: string, page : number, size : number) : Observable<pageProduct> {
    let  result = this.products.filter(p=>p.name.includes(keyword));
    let  totalPages = ~~(this.products.length/size);
    let index = page*size;
    if(this.products.length % size != 0 )
        totalPages++;
    let pageProducts = result.slice(index, index+size);
    return  of({page : page, size:size, totalPages:totalPages, products: pageProducts});
  }

  public addNewProduct( product : Product) : Observable<Product>{
   product.id = UUID.UUID();
   this.products.push(product)
    return of(product);
  }
  public  getProduct( id : string)  : Observable<Product>{
   let product= this.products.find(p=>p.id == id);
   if (product == undefined) return  throwError( ()=>new Error("product not found"));
    return of(product);

  }

  getErrorMessage(fieldName: string, error: ValidationErrors)  {
    if (error['required']){
      return fieldName+" is required";
    }else  if (error['minlength']){
      return  fieldName+" should have at least "+error['minlength']['requiredLength']+" Characters"
    } else if (error['min']){
      return  fieldName+" should have min value "+error['min']['min']+" xaf"

    }
    else return "";
  }
  public  updateProduct( product : Product) : Observable<Product>{
    this.products = this.products.map(p=>(p.id == product.id)? product :p);
    return of(product);
  }

}
