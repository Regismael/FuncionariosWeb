import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  //atributos
  funcionario: any[] = []; //array de objetos (vazio)
  endpoint: string = 'http://localhost:5117/api/Funcionario'

  //método construtor
  constructor(
    //inicilização automática
    private httpClient: HttpClient
  ) { }

  form = new FormGroup({
    nome: new FormControl('', [
      Validators.required, Validators.minLength(8),
      Validators.maxLength(100)

    ]),

    matricula: new FormControl('', [
      Validators.required
    ]),

    cpf: new FormControl('', [
      Validators.required
    ])
  });

  formEdicao = new FormGroup({
    id : new FormControl(''),

    nome: new FormControl('', [
      Validators.required, Validators.minLength(8),
      Validators.maxLength(100)

    ]),

    matricula: new FormControl('', [
      Validators.required
    ]),

    cpf: new FormControl('', [
      Validators.required
    ])
  });

  get f() {
    return this.form.controls;
  }

  get fEdicao (){
    return this.form.controls;
  }

  //método executado sempre que o componente
  //for aberto (inicializado)
  ngOnInit(): void {
    //executando uma requisição GET para consulta de contatos da API
    this.httpClient.get(this.endpoint)
      .subscribe({ //capturando o retorno da API (resposta)
        next: (data) => { //bloco que captura a resposta de sucesso
          //guardar os dados obtidos em uma variável
          this.funcionario = data as any[];
        },
        error: (e) => { //bloco que captura a resposta de erro
          console.log(e.error);
        }
      })
  }

  //função para capturar o SUBMIT do formulário
  onSubmit(): void {
    //executando uma requisição POST para consulta de contatos da API
    this.httpClient.post(this.endpoint, this.form.value)
      .subscribe({ //aguardando a resposta da API
        next: (data: any) => { //retorno de sucesso
          //exibir a mensagem na página
          alert(data.message);
          //limpar os campos do formulário
          this.form.reset();
          //fazer uma nova consulta na api
          this.ngOnInit();
        },
        error: (e) => { //retorno de erro
          console.log(e);
        }
      })
  }

  onDelete(id: string): void {
    if (confirm('Deseja realmente excluir o funcionário?')) {
     this.httpClient.delete(this.endpoint + "/" + id)
        .subscribe({
          next: (data : any) => {

          alert(data.message);

          this.ngOnInit();
          },
          error:(e) => {
            console.log(e.error);
          }

        });
    }

  }

  onEdit(id:string) : void{
    this.httpClient.get(this.endpoint + "/" + id)
    .subscribe({
    next:(data) => {
     this.formEdicao.patchValue(data)
    },
    error : (e) => {
     console.log(e.error);
    }

    });
  }

  onEditSubmit() : void{
    this.httpClient.put(this.endpoint, this.formEdicao.value)

    .subscribe({
     next : (data :  any) => {
      alert(data.message)

      this.ngOnInit();
     },

     error : (e) => {
       console.log(e.error);
     }

    });
  }
}